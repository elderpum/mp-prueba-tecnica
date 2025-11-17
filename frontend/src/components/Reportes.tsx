import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { casosService, type Caso } from '../services/casosService';
import './Reportes.css';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Reportes() {
    const [loading, setLoading] = useState(true);
    const [casosPendientes, setCasosPendientes] = useState<Caso[]>([]);
    const [casosEnProgreso, setCasosEnProgreso] = useState<Caso[]>([]);
    const [casosCerrados, setCasosCerrados] = useState<Caso[]>([]);
    const [casosArchivados, setCasosArchivados] = useState<Caso[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarCasos = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await casosService.obtenerCasos();
                if (result.success && result.data) {
                    // Filtrar casos por estado
                    const pendientes = result.data.filter(caso => caso.estado === 'Pendiente');
                    const enProgreso = result.data.filter(caso => caso.estado === 'EnProgreso');
                    const cerrados = result.data.filter(caso => caso.estado === 'Cerrado');
                    const archivados = result.data.filter(caso => caso.estado === 'Archivado');

                    setCasosPendientes(pendientes);
                    setCasosEnProgreso(enProgreso);
                    setCasosCerrados(cerrados);
                    setCasosArchivados(archivados);
                } else {
                    setError(result.message || 'Error al cargar casos');
                }
            } catch (err) {
                setError('Error al cargar casos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        cargarCasos();
    }, []);

    // Configurar datos para la gráfica
    const chartData = {
        labels: ['Pendiente', 'EnProgreso', 'Cerrado', 'Archivado'],
        datasets: [
            {
                label: 'Cantidad de Casos',
                data: [
                    casosPendientes.length,
                    casosEnProgreso.length,
                    casosCerrados.length,
                    casosArchivados.length,
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.8)',  // Pendiente - Amarillo
                    'rgba(54, 162, 235, 0.8)',  // EnProgreso - Azul
                    'rgba(75, 192, 192, 0.8)',  // Cerrado - Verde azulado
                    'rgba(153, 102, 255, 0.8)', // Archivado - Morado
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Casos por Estado',
                font: {
                    size: 18,
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    if (loading) {
        return (
            <div className="reportes-container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando estadísticas...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reportes-container">
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="reportes-container">
            <div className="container-fluid py-4">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="mb-0">
                            <i className="fas fa-chart-bar me-2"></i>
                            Reportes Generales
                        </h2>
                        <p className="text-muted">Estadísticas de casos por estado</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div style={{ height: '400px' }}>
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">
                                    <i className="fas fa-list me-2"></i>
                                    Resumen de Estadísticas
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body text-center">
                                                <h3 className="mb-1">{casosPendientes.length}</h3>
                                                <p className="text-muted mb-0">Pendiente</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body text-center">
                                                <h3 className="mb-1">{casosEnProgreso.length}</h3>
                                                <p className="text-muted mb-0">EnProgreso</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body text-center">
                                                <h3 className="mb-1">{casosCerrados.length}</h3>
                                                <p className="text-muted mb-0">Cerrado</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body text-center">
                                                <h3 className="mb-1">{casosArchivados.length}</h3>
                                                <p className="text-muted mb-0">Archivado</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

