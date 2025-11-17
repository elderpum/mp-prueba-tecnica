import DataTable from './DataTable';
import type { TableColumn } from '../types/dataTable';
import './BitacorasCasoList.css';

interface BitacoraCaso {
    id: number;
    CasoId: number;
    FiscalId: number;
    accion: string;
    descripcion?: string;
    fechaAccion: string;
}

export default function BitacorasCasoList() {
    const columns: TableColumn<BitacoraCaso>[] = [
        { 
            prop: 'CasoId', 
            name: 'Caso ID', 
            sortable: true 
        },
        { 
            prop: 'FiscalId', 
            name: 'Fiscal ID', 
            sortable: true 
        },
        { 
            prop: 'accion', 
            name: 'Acción', 
            sortable: true,
            cellRenderer: (value: string) => {
                const accionColors: Record<string, string> = {
                    'Creacion': 'bg-success',
                    'Actualizacion': 'bg-info',
                    'Reasignacion': 'bg-warning',
                    'CambioEstado': 'bg-primary',
                };
                const colorClass = accionColors[value] || 'bg-secondary';
                return (
                    <span className={`badge ${colorClass}`}>
                        {value}
                    </span>
                );
            }
        },
        { 
            prop: 'descripcion', 
            name: 'Descripción', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                const truncated = value.length > 80 ? value.substring(0, 80) + '...' : value;
                return <span title={value}>{truncated}</span>;
            }
        },
        { 
            prop: 'fechaAccion', 
            name: 'Fecha Acción', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                const date = new Date(value);
                return <span>{date.toLocaleDateString('es-GT')} {date.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</span>;
            }
        },
    ];

    return (
        <div className="bitacoras-caso-list-container">
            <DataTable<BitacoraCaso>
                title="Bitácora de Casos"
                columns={columns}
                apiUrl="/bitacoras"
                showNewButton={false}
                showSearch={true}
                searchFields={['accion', 'descripcion']}
                showPagination={true}
                pageSize={10}
            />
        </div>
    );
}

