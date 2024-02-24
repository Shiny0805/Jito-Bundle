import styles from "styles/pages/Token.module.scss"; // Page styles
// import { FileUpload } from 'primereact/fileupload';
import { PublicKey } from '@solana/web3.js';
import { getAccount } from "@solana/spl-token";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from "react";
import { LuCopy } from "react-icons/lu";
import { store } from "../../state/StateProvider";

export default function Holdings() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const { tokens } = store.useContainer()
  const [balances, setBalances] = useState<any>({})

  useEffect(() => {
    tokens.map(async (token) => {
      const tokenAccountPubkey = new PublicKey(token.account)
      const bal = await connection.getTokenAccountBalance(tokenAccountPubkey)
      setBalances((b: any) => ({ ...b, [String(token.address)]: bal.value.uiAmount}))
    })
  }, [tokens])

  return (
    <div className={styles.token}>
      <h1>Token Holdings</h1>
      <div className={styles.form}>
        <table>
          <thead>
            <tr>
              <th>Mint</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {
              tokens.map((token, index) =>
                <tr key={`holdings-${index}`}>
                  <td align="left">
                    <a onClick={() => {
                      navigator.clipboard.writeText(String(token.address))
                    }} style={{marginRight: '1em'}}>
                      <LuCopy stroke="#1e8030"/>
                    </a>
                    {token.name}
                    ({token.symbol})
                  </td>
                  <td align="right">{balances[token.address]}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
