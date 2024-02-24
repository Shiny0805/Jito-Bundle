import Link from "next/link"; // Dynamic routing
import Image from "next/image"; // Images
import styles from "styles/components/Header.module.scss"; // Component styles
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Header() {
  const route = useRouter()
  const wallet = useWallet()
  return (
    <div className={styles.header}>
      <div className={styles.header__logo}>
        <Link href="/">
          <a>
            <Image src="/logo.png" alt="Logo" width={32} height={32} priority />
          </a>
        </Link>
        <div className={styles.header__menu}>
          <Link href="/">
            <button className={route.pathname==='/' ? 'active' : ''}>Token</button>
          </Link>
          <Link href="/project">
            <button className={route.pathname==='/project' ? 'active' : ''}>Project</button>
          </Link>
        </div>
      </div>

      <div className={styles.header__actions}>
        <WalletMultiButton />
      </div>
    </div>
  );
}
