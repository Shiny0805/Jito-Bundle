import "styles/global.scss"; // Global styles
import {
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import type { AppProps } from "next/app"; // Types
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Layout from "components/Layout";
import { store } from "../state/StateProvider"

const WalletProvider = dynamic(
  () => import("../state/ClientWalletProvider"),
  {
    ssr: false,
  }
);

// Export application
export default function MyApp({
  Component,
  pageProps,
}: AppProps) {
  const endpoint = useMemo(() => "https://devnet.helius-rpc.com/?api-key=d6fef362-e3c9-414a-995e-95e6578bd8bc", []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <store.Provider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </store.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
