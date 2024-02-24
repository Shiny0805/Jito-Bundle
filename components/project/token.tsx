import styles from "styles/pages/Token.module.scss"; // Page styles
// import { FileUpload } from 'primereact/fileupload';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js';
import { useCallback, useState } from "react";
// import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { Metadata, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import axios from "axios";
import { toast } from "react-toastify";
import { AuthorityType, TOKEN_PROGRAM_ID, createSetAuthorityInstruction } from "@solana/spl-token";

export default function Mint() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [mintAddress, setMintAddress] = useState('')

  const handleMintAhtority = useCallback(async () => {
    if(publicKey) {
      try {
        if(!mintAddress)
          throw new Error('You have to input mint address')
        const tokenMint = new PublicKey(mintAddress);
        
        const revokeTokenTransaction = new Transaction().add(
          createSetAuthorityInstruction(
            tokenMint, 
            publicKey,
            AuthorityType.MintTokens, 
            null, 
            [],
            TOKEN_PROGRAM_ID
          )
        );
        await sendTransaction(revokeTokenTransaction, connection);
        toast.success('Successfully revoked!')
      } catch(ex: any) {
        toast.error(ex.message)
      }
    }
  }, [publicKey, connection, sendTransaction, mintAddress])

  return (
    <div className={styles.token}>
      <h1>Token</h1>
      <div className={styles.form}>
        <div className="group">
          <input placeholder="Mint Address" onChange={(e) => setMintAddress(e.target.value)}/>
          <button onClick={handleMintAhtority}>Save</button>
        </div>
      </div>
    </div>
  );
}
