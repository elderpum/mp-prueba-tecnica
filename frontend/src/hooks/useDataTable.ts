import { useState, useEffect, useCallback } from 'react';
import type { TableConfig, ApiResponse } from '../types/dataTable';

// Obtener la URL de la API desde las variables de entorno
const getApiUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = envUrl.replace(/\/$/, '');
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiUrl();

export function useDataTable<T = any>(config: TableConfig<T>) {
    const [allData, setAllData] = useState<T[]>([]); // Todos los datos sin filtrar
    const [data, setData] = useState<T[]>([]); // Datos filtrados y paginados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = config.pageSize || 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No autenticado');
            }

            // Construir URL (sin parámetros de búsqueda, se hace en el cliente)
            // Solo paginación si es necesario en el backend
            const params = new URLSearchParams();
            // Nota: La búsqueda se hace en el cliente, no enviamos searchTerm al backend

            // Construir URL completa
            let apiUrl: string;
            if (config.apiUrl.startsWith('http')) {
                // URL absoluta completa
                apiUrl = config.apiUrl;
            } else {
                // URL relativa - construir desde la base
                let endpoint = config.apiUrl;
                // Remover /api si está presente al inicio (ya está en API_BASE_URL)
                if (endpoint.startsWith('/api/')) {
                    endpoint = endpoint.substring(5); // Remover '/api/'
                } else if (endpoint.startsWith('/api')) {
                    endpoint = endpoint.substring(4); // Remover '/api'
                }
                // Asegurar que el endpoint empiece con /
                if (!endpoint.startsWith('/')) {
                    endpoint = '/' + endpoint;
                }
                apiUrl = `${API_BASE_URL}${endpoint}`;
            }
            
            // Asegurar que la URL termine con / si no tiene parámetros
            if (!apiUrl.endsWith('/') && params.toString().length === 0) {
                apiUrl = apiUrl + '/';
            }
            
            const url = params.toString() 
                ? `${apiUrl}?${params.toString()}`
                : apiUrl;

            console.log('Fetching data from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result: ApiResponse<T> = await response.json();

            if (result.success && result.data) {
                // Aplicar parser si existe
                const parsedData = config.dataParser 
                    ? result.data.map(item => config.dataParser!(item))
                    : result.data;
                
                // Guardar todos los datos sin filtrar
                setAllData(parsedData);
            } else {
                throw new Error(result.message || result.error || 'Error al obtener los datos');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            setAllData([]);
            setData([]);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, config.dataParser, config.showPagination]);

    // Función para filtrar datos localmente
    const filterData = useCallback((dataToFilter: T[], search: string): T[] => {
        if (!search || !config.searchFields || config.searchFields.length === 0) {
            return dataToFilter;
        }

        const searchLower = search.toLowerCase().trim();
        return dataToFilter.filter((item) => {
            // Buscar en todos los campos especificados en searchFields
            return config.searchFields!.some((field) => {
                const value = (item as any)[field];
                if (value === null || value === undefined) {
                    return false;
                }
                // Convertir a string y buscar (case-insensitive)
                return String(value).toLowerCase().includes(searchLower);
            });
        });
    }, [config.searchFields]);

    // Efecto para aplicar filtros y paginación cuando cambian los datos o el término de búsqueda
    useEffect(() => {
        // Filtrar datos
        const filtered = filterData(allData, searchTerm);
        
        // Calcular paginación
        const totalFiltered = filtered.length;
        setTotalItems(totalFiltered);

        if (config.showPagination) {
            // Aplicar paginación
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedData = filtered.slice(startIndex, endIndex);
            setData(paginatedData);
        } else {
            // Sin paginación, mostrar todos los datos filtrados
            setData(filtered);
        }
    }, [allData, searchTerm, currentPage, pageSize, config.showPagination, filterData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Resetear a la primera página al buscar
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        searchTerm,
        currentPage,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        pageSize,
        handleSearch,
        handlePageChange,
        refresh,
    };
}

