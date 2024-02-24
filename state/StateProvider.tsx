import { useEffect, useState } from "react"; // React
import { createContainer } from "unstated-next"; // State management

function useStore() {
    const [tokens, setTokens] = useState<any[]>([])

    function addToken(token: any) {
        setTokens((t) => [...t, token])
    }

    return  {
        tokens, addToken
    }
}
export const store = createContainer(useStore);