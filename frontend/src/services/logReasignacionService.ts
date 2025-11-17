// Obtener la URL de la API desde las variables de entorno
const getApiUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = envUrl.replace(/\/$/, '');
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiUrl();

export interface LogReasignacionFallida {
    id: number;
    CasoId: number;
    FiscalOrigenId: number;
    FiscalDestinoId: number;
    motivoBloqueo: string;
    fechaIntento: string;
}

class LogReasignacionService {
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

    async obtenerLogsReasignacion(
        casoId?: number,
        fiscalOrigenId?: number,
        fiscalDestinoId?: number
    ): Promise<{ success: boolean; data?: LogReasignacionFallida[]; count?: number; message?: string }> {
        try {
            const params = new URLSearchParams();
            if (casoId !== undefined) params.append('casoId', casoId.toString());
            if (fiscalOrigenId !== undefined) params.append('fiscalOrigenId', fiscalOrigenId.toString());
            if (fiscalDestinoId !== undefined) params.append('fiscalDestinoId', fiscalDestinoId.toString());
            
            const queryString = params.toString();
            const url = queryString ? `${API_BASE_URL}/logs-reasignacion?${queryString}` : `${API_BASE_URL}/logs-reasignacion`;
            
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

    async crearLogReasignacion(
        log: Omit<LogReasignacionFallida, 'id'>
    ): Promise<{ success: boolean; message?: string; data?: any }> {
        try {
            const response = await fetch(`${API_BASE_URL}/logs-reasignacion`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(log),
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

export const logReasignacionService = new LogReasignacionService();

