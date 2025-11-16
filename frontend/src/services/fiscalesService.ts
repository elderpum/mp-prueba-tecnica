// Obtener la URL de la API desde las variables de entorno
const getApiUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = envUrl.replace(/\/$/, '');
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiUrl();

export interface Fiscal {
    id: number;
    nombre: string;
    email: string;
    password?: string;
    rol: string;
    estado: boolean;
    fechaCreacion: string | null;
    FiscaliaId: number;
}

class FiscalesService {
    private getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async obtenerFiscalPorId(id: number): Promise<{ success: boolean; data?: Fiscal; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscales/${id}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    async crearFiscal(fiscal: Omit<Fiscal, 'id'>): Promise<{ success: boolean; message?: string; data?: any }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscales`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(fiscal),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    async actualizarFiscal(id: number, fiscal: Partial<Fiscal>): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscales/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(fiscal),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    async eliminarFiscal(id: number): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscales/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            const result = await response.json();
            console.log(result);
            return result;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

}

export const fiscalesService = new FiscalesService();

