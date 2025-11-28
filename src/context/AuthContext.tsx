import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    address: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            loadUser();
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await api.get('/auth/profile');
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, accessToken, refreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
    };

    const signup = async (data: any) => {
        const response = await api.post('/auth/signup', data);
        const { user, accessToken, refreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};