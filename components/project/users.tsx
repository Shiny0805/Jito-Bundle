import styles from "styles/pages/Token.module.scss"; // Page styles
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from "react";

export default function Zombie() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [mintAddress, setMintAddress] = useState('')

  const handleSave = useCallback(async () => {
    
  }, [])

  return (
    <div className={styles.token}>
      <h1>Buyers / Sellers</h1>
      <div className={styles.form} style={{width: '100%'}}>
        <div className="group">
          <input placeholder="Address to send SOL when you sell"/>
          <button>Collect All SOL</button>
        </div>
        <div className="group">
          <button>Generate New Addresses</button>
          <button>Download Wallets</button>
          <span/>
          <button>Set Amount for selected wallets</button>
          <button>Set SOL for selected wallets</button>
        </div>
        <table>
          <col width="40px"/>
          <col width="40px"/>
          <col/>
          <col width="120px"/>
          <col width="100px"/>
          <col width="20px"/>
          <col width="120px"/>
          <col width="100px"/>
          <col width="20px"/>
          <col/>
          <col width="150px"/>
          <thead>
            <tr>
              <th></th>
              <th>No</th>
              <th>Address</th>
              <th>Amount to buy</th>
              <th>SOL to send</th>
              <th></th>
              <th>Token remaining</th>
              <th>% to sell</th>
              <th></th>
              <th>Address to transfer</th>
              <th>Amount to transfer</th>
            </tr>
          </thead>
          <tbody>
            {
              new Array(10).fill(0).map((_, index) => 
                <tr key={index}>
                  <td><input type="checkbox"/></td>
                  <td>{index + 1}</td>
                  <td><input/></td>
                  <td><input type="number"/></td>
                  <td><input type="number"/></td>
                  <td>|</td>
                  <td><input type="number"/></td>
                  <td><input type="number"/></td>
                  <td>|</td>
                  <td><input/></td>
                  <td><input type="number"/></td>
                </tr>
              )
            }
          </tbody>
        </table>
        <div className="group" style={{justifyContent: 'center', gap: '2em'}}>
          <button>Simulate</button>
          <button>Disperse SOL</button>
          <button>Create Pool and Buy</button>
          <button>Sell</button>
          <button>Transfer</button>
        </div>
      </div>
    </div>
  );
}
