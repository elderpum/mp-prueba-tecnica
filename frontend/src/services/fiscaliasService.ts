// Obtener la URL de la API desde las variables de entorno
const getApiUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = envUrl.replace(/\/$/, '');
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiUrl();

export interface Fiscalia {
    id: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    estado: boolean;
    fechaCreacion: string;
}

class FiscaliasService {
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

    async obtenerFiscalias(estado?: boolean): Promise<{ success: boolean; data?: Fiscalia[]; count?: number; message?: string }> {
        try {
            const params = estado !== undefined ? `?estado=${estado}` : '';
            const response = await fetch(`${API_BASE_URL}/fiscalias${params}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    async obtenerFiscaliaPorId(id: number): Promise<{ success: boolean; data?: Fiscalia; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscalias/${id}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    async crearFiscalia(fiscalia: Omit<Fiscalia, 'id'>): Promise<{ success: boolean; message?: string; data?: any }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscalias`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(fiscalia),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: 'Fiscalía creada exitosamente',
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    async actualizarFiscalia(id: number, fiscalia: Partial<Fiscalia>): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscalias/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(fiscalia),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: result.message || 'Fiscalía actualizada correctamente',
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    async eliminarFiscalia(id: number): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/fiscalias/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: result.message || 'Fiscalía eliminada correctamente',
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }
}

export const fiscaliasService = new FiscaliasService();

