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
      <h1>Zombie Wallet</h1>
      <div className={styles.form}>
        <div className="group">
          <input placeholder="Private key for dispersing SOL"/>
          <button onClick={handleSave}>Save</button>
        </div>
        <input placeholder="Wallet for dispersing SOL"/>
        <input placeholder="SOL needed to buy tokens"/>
      </div>
    </div>
  );
}
