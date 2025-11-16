import DataTable from './DataTable';
import type { TableColumn } from '../types/dataTable';
import './LogsReasignacionList.css';

interface LogReasignacionFallida {
    id: number;
    CasoId: number;
    FiscalOrigenId: number;
    FiscalDestinoId: number;
    motivoBloqueo: string;
    fechaIntento: string;
}

export default function LogsReasignacionList() {
    const columns: TableColumn<LogReasignacionFallida>[] = [
        { 
            prop: 'CasoId', 
            name: 'Caso ID', 
            sortable: true 
        },
        { 
            prop: 'FiscalOrigenId', 
            name: 'Fiscal Origen ID', 
            sortable: true 
        },
        { 
            prop: 'FiscalDestinoId', 
            name: 'Fiscal Destino ID', 
            sortable: true 
        },
        { 
            prop: 'motivoBloqueo', 
            name: 'Motivo de Bloqueo', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                const truncated = value.length > 80 ? value.substring(0, 80) + '...' : value;
                return <span title={value}>{truncated}</span>;
            }
        },
        { 
            prop: 'fechaIntento', 
            name: 'Fecha Intento', 
            sortable: true,
            cellRenderer: (value: string) => {
                if (!value) return <span className="text-muted">-</span>;
                const date = new Date(value);
                return <span>{date.toLocaleDateString('es-GT')} {date.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</span>;
            }
        },
    ];

    return (
        <div className="logs-reasignacion-list-container">
            <DataTable<LogReasignacionFallida>
                title="Logs de Reasignación Fallida"
                columns={columns}
                apiUrl="/logs-reasignacion"
                showNewButton={false}
                showSearch={true}
                searchFields={['motivoBloqueo']}
                showPagination={true}
                pageSize={10}
            />
        </div>
    );
}

