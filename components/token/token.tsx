import styles from "styles/pages/Token.module.scss"; // Page styles
// import { FileUpload } from 'primereact/fileupload';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useCallback, useState } from "react";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../../state/StateProvider";

export default function Token() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [tokenName, setTokenName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [logo, setLogo] = useState('')
  const [amount, setAmount] = useState('')
  const [decimals, setDecimals] = useState('')

  const { addToken } = store.useContainer()

  const uploadImage = (img: any) => {
    console.log(img)
    let body = new FormData()
    body.set('key', 'f1f72521153371f4eb0ee58cad38a5f7')
    body.append('image', img)

    return axios({
      method: 'post',
      url: 'https://api.imgbb.com/1/upload',
      data: body
    }).then(({data}) => {
      setLogo(data.data.display_url)
    })
  }

  const handleCreateToken = useCallback(async () => {
    if(publicKey) {
      try {
        if(!tokenName)
          throw new Error('You have to input token name')
        if(!symbol)
          throw new Error('You have to input token symbol')
        if(!decimals)
          throw new Error('You have to input token decimals')
        if(!amount)
          throw new Error('You have to input total supply')
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const mintKeypair = Keypair.generate();
        const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);

        const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
          {
            metadata: PublicKey.findProgramAddressSync(
              [
                Buffer.from("metadata"),
                PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
              ],
              PROGRAM_ID,
            )[0],
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: tokenName,
                symbol: symbol,
                uri: '',
                creators: null,
                sellerFeeBasisPoints: 0,
                uses: null,
                collection: null,
              },
              isMutable: false,
              collectionDetails: null,
            },
          },
        );

        const createNewTokenTransaction = new Transaction().add(
          SystemProgram.createAccount({
              fromPubkey: publicKey,
              newAccountPubkey: mintKeypair.publicKey,
              space: MINT_SIZE,
              lamports: lamports,
              programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMintInstruction(
            mintKeypair.publicKey, 
            Number(decimals), 
            publicKey, 
            publicKey, 
            TOKEN_PROGRAM_ID),
          createAssociatedTokenAccountInstruction(
            publicKey,
            tokenATA,
            publicKey,
            mintKeypair.publicKey,
          ),
          createMintToInstruction(
            mintKeypair.publicKey,
            tokenATA,
            publicKey,
            Number(amount) * Math.pow(10, Number(decimals)),
          ),
          createMetadataInstruction
        );
        await sendTransaction(createNewTokenTransaction, connection, {signers: [mintKeypair]});
        addToken({
          name: tokenName,
          symbol,
          decimals,
          address: mintKeypair.publicKey,
          account: tokenATA
        })
        console.log('token', tokenATA, mintKeypair.publicKey)
        toast.success('Successfully created!')
      } catch(ex: any) {
        toast.error(ex.message)
      }
    }
  }, [publicKey, connection, sendTransaction, tokenName, symbol, amount, decimals])

  return (
    <div className={styles.token}>
      <h1>Create Token</h1>
      <div className={styles.form}>
        <input placeholder="Name" onChange={(e) => setTokenName(e.target.value)}/>
        <input placeholder="Symbol" onChange={(e) => setSymbol(e.target.value)}/>
        <div className="group">
          <input placeholder="Logo URI" onChange={(e) => setLogo(e.target.value)} value={logo}/>
          <button style={{position: 'relative'}}>
            Upload Logo
            <input type="file" onChange={(e:any) => {
              uploadImage(e.target.files[0])
              e.target.value = null
            }}/>
          </button>
        </div>
        <input placeholder="Decimals" type="number" onChange={(e) => setDecimals(e.target.value)}/>
        <input placeholder="Total Supply" type="number" onChange={(e) => setAmount(e.target.value)}/>
        <p>
          Note: This token launcher creates tokens WITHOUT freeze authority so there is no need to revoke it.
        </p>
        <button type="submit" onClick={handleCreateToken}>Create Token</button>
      </div>
    </div>
  );
}
