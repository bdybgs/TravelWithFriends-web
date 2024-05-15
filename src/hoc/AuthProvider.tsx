import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
    user: any;  // Укажите более конкретный тип в зависимости от структуры вашего пользователя
    isAdmin: boolean;
    signin: (newUser: any, callback: () => void) => void;
    signout: (callback: () => void) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    isAdmin: false,
    signin: () => {},
    signout: () => {}
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const localStorageUser =
    {
        name: localStorage.getItem("name")
    }
    const [user, setUser] = useState<any>(localStorageUser);
    const [isAdmin, setIsAdmin] = useState<boolean>(Boolean(localStorage.getItem("isAdmin")));

    const signin = (newUser: any, callback: () => void) => {
        console.log("Signing in:", newUser);
        setUser(newUser);
        setIsAdmin(newUser.isAdmin); // Устанавливаем статус администратора при входе
        localStorage.setItem("email", newUser.name);
        localStorage.setItem("isAdmin", newUser.isAdmin);
        if (callback) callback();
    }

    const signout = (callback: () => void) => {
        console.log("Signing out");
        setUser(null);
        setIsAdmin(false); // Сбрасываем статус администратора при выходе
        localStorage.removeItem("email");
        localStorage.removeItem("isAdmin");
        if (callback) callback();
    }

    const value = { user, isAdmin, signin, signout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
