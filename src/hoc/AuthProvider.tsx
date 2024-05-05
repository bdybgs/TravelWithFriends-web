import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
    user: any;  // Укажите более конкретный тип в зависимости от структуры вашего пользователя
    signin: (newUser: any, callback: () => void) => void;
    signout: (callback: () => void) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    signin: () => {},
    signout: () => {}
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    const signin = (newUser: any, callback: () => void) => {
        console.log("Signing in:", newUser);
        setUser(newUser);
        if (callback) callback();
    }

    const signout = (callback: () => void) => {
        console.log("Signing out");
        setUser(null);
        if (callback) callback();
    }

    const value = { user, signin, signout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
