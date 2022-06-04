import React, { useEffect, useState } from "react";

export const UserContext = React.createContext(null);

let initialUser;
try {
    initialUser = JSON.parse(localStorage.getItem('user')) || {};
} catch (error) {
    console.error("Error occurred during authentication");
    initialUser = {};
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(initialUser);
    useEffect(() => {
        if (!!user.id) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user')
    }, [user.id])
    const contextValue = {
        user,
        setUser
    }

    return <UserContext.Provider value={contextValue}>
        {children}
    </UserContext.Provider>
}