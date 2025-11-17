// Obtener la URL de la API desde las variables de entorno
const getApiUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = envUrl.replace(/\/$/, '');
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiUrl();

export interface BitacoraCaso {
    id: number;
    CasoId: number;
    FiscalId: number;
    accion: string;
    descripcion?: string;
    fechaAccion: string;
}

class BitacorasService {
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

    async obtenerBitacoras(
        casoId?: number,
        fiscalId?: number
    ): Promise<{ success: boolean; data?: BitacoraCaso[]; count?: number; message?: string }> {
        try {
            const params = new URLSearchParams();
            if (casoId !== undefined) params.append('casoId', casoId.toString());
            if (fiscalId !== undefined) params.append('fiscalId', fiscalId.toString());
            
            const queryString = params.toString();
            const url = queryString ? `${API_BASE_URL}/bitacoras?${queryString}` : `${API_BASE_URL}/bitacoras`;
            
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

    async obtenerBitacoraPorId(id: number): Promise<{ success: boolean; data?: BitacoraCaso; message?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/bitacoras/${id}`, {
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
}

export const bitacorasService = new BitacorasService();

