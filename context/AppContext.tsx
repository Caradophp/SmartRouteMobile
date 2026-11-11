import { useWebSocket } from "@/hooks/use-web-socket";
import React, { createContext, ReactNode, useState } from "react";

interface AppContextProps {
    token: string | undefined,
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const AppContext = createContext({} as AppContextProps);

interface ContextProps {
    children: ReactNode
}

const AppProvider = ({ children }: ContextProps) => {
    const [token, setToken] = useState<string>();

    const webSocket = useWebSocket();

    return (
        <AppContext.Provider value={{token, setToken}}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;