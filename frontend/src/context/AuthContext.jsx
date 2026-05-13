import LoadingScreen from '@/components/ui-components/LoadingScreen';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const saved_user = localStorage.getItem('user');
        if (saved_user){
            setUser(JSON.parse(saved_user));
        }

        const timer = setTimeout(() =>{
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    if (loading){
        return (
            <LoadingScreen/>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);