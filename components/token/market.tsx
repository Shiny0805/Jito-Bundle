import styles from "styles/pages/Token.module.scss"; // Page styles
// import { FileUpload } from 'primereact/fileupload';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { useCallback, useState } from "react";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, Metadata, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import axios from "axios";
import { toast } from "react-toastify";
import {
  Token,
  MarketV2,
  TxVersion,
  MAINNET_PROGRAM_ID,
  DEVNET_PROGRAM_ID,
  buildSimpleTransaction
} from "@raydium-io/raydium-sdk";

export default function Market() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [mintAddress, setMintAddress] = useState('')
  const [orderSize, setOrderSize] = useState('')
  const [priceSize, setPriceSize] = useState('')

  const handleOpenMarket = useCallback(async () => {
    if (publicKey) {
      try {
        if (!mintAddress)
          throw new Error('You have to input mint address')
        if (!orderSize)
          throw new Error('You have to input minimum order size')
        if (!priceSize)
          throw new Error('You have to input minimum price tick size')
        const tokenMint = new PublicKey(mintAddress);
        const mint = await connection.getParsedAccountInfo(tokenMint)
        const metadataPDA = PublicKey.findProgramAddressSync(
          [
            Buffer.from("metadata"),
            PROGRAM_ID.toBuffer(),
            tokenMint.toBuffer(),
          ],
          PROGRAM_ID,
        )[0]
        const metadataAccount = await connection.getAccountInfo(metadataPDA);
        if (!metadataAccount)
          throw new Error('Cannot find metadata')
        const [metadata, _] = await Metadata.deserialize(metadataAccount.data);
        const baseToken = new Token(TOKEN_PROGRAM_ID, tokenMint, (mint.value?.data as any).parsed?.info.decimals, metadata.data.symbol.replaceAll('\x00', ''), metadata.data.name.replaceAll('\x00', ''))
        const quoteToken = new Token(TOKEN_PROGRAM_ID, new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL')
        const makeTxVersion = TxVersion.V0
        const createMarketInstruments = await MarketV2.makeCreateMarketInstructionSimple({
          connection,
          wallet: publicKey,
          baseInfo: baseToken,
          quoteInfo: quoteToken,
          lotSize: Number(orderSize), // default 1
          tickSize: Number(priceSize), // default 0.01
          dexProgramId: (process.env.IS_MAINNET ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID).OPENBOOK_MARKET,
          makeTxVersion,
        })
        const marketId = createMarketInstruments.address.marketId

        const willSendTx = await buildSimpleTransaction({
          connection,
          makeTxVersion,
          payer: publicKey,
          innerTransactions: createMarketInstruments.innerTransactions,
          addLookupTableInfo: undefined,
        })

        const txids = [];
        for (const iTx of willSendTx) {
          txids.push(await sendTransaction(iTx, connection, { skipPreflight: true }));
        }
        console.log('Market Created')
        console.log('Create Market Transactions :', txids)
        console.log('Market Address :', marketId)
        toast.success('Successfully created!')
      } catch (ex: any) {
        toast.error(ex.message)
      }
    }
  }, [publicKey, connection, sendTransaction, mintAddress, orderSize, priceSize])

  return (
    <div className={styles.token}>
      <h1>OpenBook Market</h1>
      <div className={styles.form}>
        <input placeholder="Mint Address" onChange={(e) => setMintAddress(e.target.value)} />
        <input placeholder="Minimum Order Size" onChange={(e) => setOrderSize(e.target.value)} />
        <input placeholder="Minimum Price Tick Size" onChange={(e) => setPriceSize(e.target.value)} />
        <button type="submit" onClick={handleOpenMarket}>Create OpenBook Market</button>
      </div>
    </div>
  );
}
