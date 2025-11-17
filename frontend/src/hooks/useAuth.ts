import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { LoginResponse } from '../services/api';

interface User {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    fiscaliaId: number;
}

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (apiService.isAuthenticated()) {
                try {
                    const response: LoginResponse = await apiService.verifyToken();
                    if (response.success && response.user) {
                        setIsAuthenticated(true);
                        setUser(response.user);
                    } else {
                        apiService.logout();
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    apiService.logout();
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        apiService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return {
        isAuthenticated,
        loading,
        user,
        login,
        logout,
    };
}

