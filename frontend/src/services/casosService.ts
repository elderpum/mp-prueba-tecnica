// Obtener la URL de la API desde las variables de entorno
const getApiUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = envUrl.replace(/\/$/, '');
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiUrl();

export interface Caso {
    id: number;
    titulo: string;
    descripcion?: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    estado: string; // Pendiente, EnProgreso, Cerrado, Archivado
    prioridad: string; // Alta, Media, Baja
    FiscalId: number;
}

class CasosService {
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

    async obtenerCasos(fiscalId?: number, estado?: string): Promise<{ success: boolean; data?: Caso[]; count?: number; message?: string }> {
        try {
            const params = new URLSearchParams();
            if (fiscalId !== undefined) params.append('fiscalId', fiscalId.toString());
            if (estado) params.append('estado', estado);
            
            const queryString = params.toString();
            const url = queryString ? `${API_BASE_URL}/casos?${queryString}` : `${API_BASE_URL}/casos`;
            
            const response = await fetch(url, {
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

    async obtenerCasoPorId(id: number): Promise<{ success: boolean; data?: Caso; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/casos/${id}`, {
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

    async crearCaso(caso: Omit<Caso, 'id'>): Promise<{ success: boolean; message?: string; data?: any }> {
        try {
            const response = await fetch(`${API_BASE_URL}/casos`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(caso),
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

    async actualizarCaso(id: number, caso: Partial<Caso>): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/casos/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(caso),
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

    async eliminarCaso(id: number): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/casos/${id}`, {
                method: 'DELETE',
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
}

export const casosService = new CasosService();

