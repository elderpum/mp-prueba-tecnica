import DataTable from './DataTable';
import type { TableColumn } from '../types/dataTable';
import './CasosList.css';

interface Caso {
    id: number;
    titulo: string;
    descripcion?: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    estado: string;
    prioridad: string;
    FiscalId: number;
}

export default function CasosList() {
    const columns: TableColumn<Caso>[] = [
        { 
            prop: 'titulo', 
            name: 'Título', 
            sortable: true 
        },
        { 
            prop: 'descripcion', 
            name: 'Descripción', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                const truncated = value.length > 50 ? value.substring(0, 50) + '...' : value;
                return <span title={value}>{truncated}</span>;
            }
        },
        { 
            prop: 'estado', 
            name: 'Estado', 
            sortable: true,
            cellRenderer: (value: string) => {
                const estadoColors: Record<string, string> = {
                    'Pendiente': 'bg-warning',
                    'EnProgreso': 'bg-info',
                    'Cerrado': 'bg-success',
                    'Archivado': 'bg-secondary',
                };
                const colorClass = estadoColors[value] || 'bg-secondary';
                return (
                    <span className={`badge ${colorClass}`}>
                        {value}
                    </span>
                );
            }
        },
        { 
            prop: 'prioridad', 
            name: 'Prioridad', 
            sortable: true,
            cellRenderer: (value: string) => {
                const prioridadColors: Record<string, string> = {
                    'Alta': 'bg-danger',
                    'Media': 'bg-warning',
                    'Baja': 'bg-success',
                };
                const colorClass = prioridadColors[value] || 'bg-secondary';
                return (
                    <span className={`badge ${colorClass}`}>
                        {value}
                    </span>
                );
            }
        },
        { 
            prop: 'FiscalId', 
            name: 'Fiscal ID', 
            sortable: true 
        },
        { 
            prop: 'fechaCreacion', 
            name: 'Fecha Creación', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                const date = new Date(value);
                return <span>{date.toLocaleDateString('es-GT')}</span>;
            }
        },
    ];

    return (
        <div className="casos-list-container">
            <DataTable<Caso>
                title="Casos"
                columns={columns}
                apiUrl="/casos"
                showNewButton={true}
                newButtonRoute="/casos/nuevo"
                newButtonText="Nuevo Caso"
                detailRoute="/casos/detalle"
                showSearch={true}
                searchFields={['titulo', 'descripcion']}
                showPagination={true}
                pageSize={10}
            />
        </div>
    );
}

