// Tipos e interfaces para el componente de tabla genérico

export interface TableColumn<T = any> {
    /** Propiedad del objeto a mostrar en la columna */
    prop: keyof T | string;
    /** Nombre de la columna (header) */
    name: string;
    /** Si la columna es ordenable */
    sortable?: boolean;
    /** Función personalizada para renderizar el contenido de la celda */
    cellRenderer?: (value: any, row: T) => React.ReactNode;
    /** Ancho de la columna (opcional) */
    width?: string | number;
    /** Clase CSS adicional para la columna */
    className?: string;
}

export interface TableConfig<T = any> {
    /** Columnas de la tabla */
    columns: TableColumn<T>[];
    /** URL del endpoint de la API para obtener los datos */
    apiUrl: string;
    /** Función para parsear/transformar un elemento individual recibido de la API */
    dataParser?: (data: any) => T;
    /** Título de la tabla */
    title?: string;
    /** Si mostrar el botón de "Nuevo" */
    showNewButton?: boolean;
    /** Ruta para crear un nuevo registro */
    newButtonRoute?: string;
    /** Texto del botón nuevo (por defecto "Nuevo") */
    newButtonText?: string;
    /** Función callback cuando se hace click en una fila */
    onRowClick?: (row: T) => void;
    /** Ruta base para el detalle (se concatena con el ID) */
    detailRoute?: string;
    /** Si mostrar búsqueda */
    showSearch?: boolean;
    /** Campos disponibles para búsqueda */
    searchFields?: string[];
    /** Si mostrar paginación */
    showPagination?: boolean;
    /** Tamaño de página por defecto */
    pageSize?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T[];
    count?: number;
    message?: string;
    error?: string;
}

