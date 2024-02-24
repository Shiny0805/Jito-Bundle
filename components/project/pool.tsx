import styles from "styles/pages/Token.module.scss"; // Page styles
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from "react";

export default function Pool() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  return (
    <div className={styles.token}>
      <h1>Pool</h1>
      <div className={styles.form}>
        <div className="group">
          <input placeholder="Token Amount"/>
          <input placeholder="SOL Amount"/>
        </div>
      </div>
    </div>
  );
}
