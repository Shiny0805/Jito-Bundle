import type { WalletProviderProps } from "@solana/wallet-adapter-react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
    PhantomWalletAdapter,
    WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { useMemo } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import('@solana/wallet-adapter-react-ui/styles.css' as any);

export function ClientWalletProvider(
    props: Omit<WalletProviderProps, "wallets">
): JSX.Element {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new WalletConnectWalletAdapter({
                network: WalletAdapterNetwork.Devnet,
                options: {
                    projectId: process.env.WALLECTCONNECT_PROJECT_ID
                },
            }),
        ],
        []
    );

    return (
        <WalletProvider wallets={wallets} {...props}>
            <WalletModalProvider {...props} />
        </WalletProvider>
    );


}

export default ClientWalletProvider;
