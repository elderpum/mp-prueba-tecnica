import DataTable from './DataTable';
import type { TableColumn } from '../types/dataTable';
import './FiscaliasList.css';

interface Fiscalia {
    id: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    estado: boolean;
    fechaCreacion: string;
}

export default function FiscaliasList() {
    const columns: TableColumn<Fiscalia>[] = [
        { 
            prop: 'nombre', 
            name: 'Nombre', 
            sortable: true 
        },
        { 
            prop: 'direccion', 
            name: 'Dirección', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                return <span>{value}</span>;
            }
        },
        { 
            prop: 'telefono', 
            name: 'Teléfono', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                return <span>{value}</span>;
            }
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
        <div className="fiscalias-list-container">
            <DataTable<Fiscalia>
                title="Fiscalías"
                columns={columns}
                apiUrl="/fiscalias"
                showNewButton={true}
                newButtonRoute="/fiscalias/nuevo"
                newButtonText="Nueva Fiscalía"
                detailRoute="/fiscalias/detalle"
                showSearch={true}
                searchFields={['nombre', 'direccion', 'telefono']}
                showPagination={true}
                pageSize={10}
            />
        </div>
    );
}

