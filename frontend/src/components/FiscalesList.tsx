import DataTable from './DataTable';
import type { TableColumn } from '../types/dataTable';
import './FiscalesList.css';

interface Fiscal {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    estado: boolean;
    fechaCreacion: string;
    FiscaliaId: number;
}

export default function FiscalesList() {
    const columns: TableColumn<Fiscal>[] = [
        { 
            prop: 'nombre', 
            name: 'Nombre', 
            sortable: true 
        },
        { 
            prop: 'email', 
            name: 'Email', 
            sortable: true 
        },
        { 
            prop: 'rol', 
            name: 'Rol', 
            sortable: true 
        },
        { 
            prop: 'FiscaliaId', 
            name: 'Fiscalía ID', 
            sortable: true 
        },
        { 
            prop: 'estado', 
            name: 'Estado', 
            sortable: true,
            cellRenderer: (value: boolean) => (
                <span className={`badge ${value ? 'bg-success' : 'bg-secondary'}`}>
                    {value ? 'Activo' : 'Inactivo'}
                </span>
            )
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
        <div className="fiscales-list-container">
            <DataTable<Fiscal>
                title="Fiscales"
                columns={columns}
                apiUrl="/fiscales"
                showNewButton={true}
                newButtonRoute="/fiscales/nuevo"
                newButtonText="Nuevo Fiscal"
                detailRoute="/fiscales/detalle"
                showSearch={true}
                searchFields={['nombre', 'email', 'rol']}
                showPagination={true}
                pageSize={10}
            />
        </div>
    );
}

