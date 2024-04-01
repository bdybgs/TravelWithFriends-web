import {createContext, SetStateAction, useState} from 'react';

export const AuthContext = createContext(null);

// @ts-ignore
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const signin = (newUser: SetStateAction<null>, cb: () => void) => {
        setUser(newUser);
        cb();
    }
    const signout = (cb: () => void) => {
        setUser(null);
        cb();
    }

    const value = {user, signin, signout}

    // @ts-ignore
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}