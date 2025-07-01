import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from session storage on mount
        const savedUser = sessionStorage.getItem('santaSlay_user');
        if (savedUser) {
            try {
                setUserState(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                sessionStorage.removeItem('santaSlay_user');
            }
        }
        setIsLoading(false);
    }, []);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            sessionStorage.setItem('santaSlay_user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('santaSlay_user');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
