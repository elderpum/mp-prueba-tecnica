import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { casosService, type Caso } from '../services/casosService';
import { fiscalesService, type Fiscal } from '../services/fiscalesService';
import { logReasignacionService } from '../services/logReasignacionService';
import './CasoForm.css';

export default function CasoForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determinar el modo según la ruta
    const pathSegments = location.pathname.split('/');
    const modoCreacion = pathSegments.includes('nuevo');
    const modoEdicion = pathSegments.includes('editar');
    const modoDetalle = pathSegments.includes('detalle');

    const [loading, setLoading] = useState(false);
    const [fiscales, setFiscales] = useState<Fiscal[]>([]);
    const [caso, setCaso] = useState<Caso>({
        id: 0,
        titulo: '',
        descripcion: '',
        fechaCreacion: '',
        fechaActualizacion: '',
        estado: 'Pendiente',
        prioridad: 'Media',
        FiscalId: -1,
    });
    const [fiscalIdOriginal, setFiscalIdOriginal] = useState<number>(-1);
    const [estadoOriginal, setEstadoOriginal] = useState<string>('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Obtener título según el modo
    const getTitle = () => {
        if (modoCreacion) return 'Agregar nuevo caso';
        if (modoEdicion) return 'Editar caso';
        if (modoDetalle) return 'Detalle de caso';
        return 'Caso';
    };

    // Cargar fiscales y datos del caso
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            
            // Cargar fiscales activos
            try {
                const fiscalesResult = await fiscalesService.obtenerFiscales();
                if (fiscalesResult.success && fiscalesResult.data) {
                    setFiscales(fiscalesResult.data.filter(f => f.estado));
                }
            } catch (error) {
                console.error('Error al cargar fiscales:', error);
            }

            // Cargar caso si es edición o detalle
            if ((modoEdicion || modoDetalle) && id) {
                const casoResult = await casosService.obtenerCasoPorId(parseInt(id));
                if (casoResult.success && casoResult.data) {
                    setCaso(casoResult.data);
                    // Guardar el FiscalId y estado originales para comparar después
                    setFiscalIdOriginal(casoResult.data.FiscalId);
                    setEstadoOriginal(casoResult.data.estado);
                } else {
                    navigate('/404');
                }
            }
            
            setLoading(false);
        };

        loadData();
    }, [id, modoEdicion, modoDetalle, navigate]);

    // Validar formulario
    const validarFormulario = (): boolean => {
        const nuevosErrores: Record<string, string> = {};

        if (!caso.titulo.trim()) {
            nuevosErrores.titulo = 'El título es requerido';
        }

        if (!caso.FiscalId || caso.FiscalId === -1) {
            nuevosErrores.FiscalId = 'El fiscal es requerido';
        }

        if (!caso.estado) {
            nuevosErrores.estado = 'El estado es requerido';
        }

        if (!caso.prioridad) {
            nuevosErrores.prioridad = 'La prioridad es requerida';
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Guardar caso
    const handleGuardar = async () => {
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);

        try {
            let result;
            if (modoCreacion) {
                result = await casosService.crearCaso({
                    titulo: caso.titulo,
                    descripcion: caso.descripcion || undefined,
                    estado: caso.estado,
                    prioridad: caso.prioridad,
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString(),
                    FiscalId: caso.FiscalId,
                });
            } else if (modoEdicion && id) {
                // Verificar si se está intentando reasignar el caso
                const seCambioFiscal = caso.FiscalId !== fiscalIdOriginal;
                
                if (seCambioFiscal) {
                    // Validar reasignación
                    const fiscalOrigen = fiscales.find(f => f.id === fiscalIdOriginal);
                    const fiscalDestino = fiscales.find(f => f.id === caso.FiscalId);
                    
                    let motivoBloqueo = '';
                    let reasignacionValida = true;
                    
                    // Validar que el estado original sea Pendiente (usar estadoOriginal, no caso.estado)
                    if (estadoOriginal !== 'Pendiente') {
                        reasignacionValida = false;
                        motivoBloqueo = `El caso no puede ser reasignado porque su estado es "${estadoOriginal}". Solo los casos con estado "Pendiente" pueden ser reasignados.`;
                    }
                    
                    // Validar que ambos fiscales pertenezcan a la misma fiscalía
                    if (reasignacionValida && fiscalOrigen && fiscalDestino) {
                        if (fiscalOrigen.FiscaliaId !== fiscalDestino.FiscaliaId) {
                            reasignacionValida = false;
                            motivoBloqueo = `El caso no puede ser reasignado porque el fiscal de destino pertenece a una fiscalía diferente. Fiscal origen: Fiscalía ID ${fiscalOrigen.FiscaliaId}, Fiscal destino: Fiscalía ID ${fiscalDestino.FiscaliaId}.`;
                        }
                    }
                    
                    if (!reasignacionValida) {
                        // Crear log de reasignación fallida
                        try {
                            await logReasignacionService.crearLogReasignacion({
                                CasoId: parseInt(id),
                                FiscalOrigenId: fiscalIdOriginal,
                                FiscalDestinoId: caso.FiscalId,
                                motivoBloqueo: motivoBloqueo,
                                fechaIntento: new Date().toISOString(),
                            });
                        } catch (logError) {
                            console.error('Error al crear log de reasignación fallida:', logError);
                        }
                        
                        alert(`No se pudo reasignar el caso:\n\n${motivoBloqueo}\n\nSe ha registrado un log del intento fallido.`);
                        setLoading(false);
                        return;
                    }
                }
                
                // Si la reasignación es válida o no se cambió el fiscal, actualizar normalmente
                const updateData: Partial<Caso> = {
                    titulo: caso.titulo,
                    descripcion: caso.descripcion || undefined,
                    estado: caso.estado,
                    prioridad: caso.prioridad,
                    fechaActualizacion: new Date().toISOString(),
                    FiscalId: caso.FiscalId,
                };
                result = await casosService.actualizarCaso(parseInt(id), updateData);
            }

            if (result?.success) {
                navigate('/casos');
            } else {
                alert(result?.message || 'Error al guardar el caso');
            }
        } catch (error) {
            alert('Error al guardar el caso');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar caso
    const handleEliminar = async () => {
        if (!id) return;
        
        if (!window.confirm('¿Está seguro de que desea eliminar este caso?')) {
            return;
        }

        setLoading(true);
        try {
            const result = await casosService.eliminarCaso(parseInt(id));
            if (result.success) {
                alert(result.message || 'Caso eliminado correctamente');
                navigate('/casos');
            } else {
                alert(result.message || 'Error al eliminar el caso');
            }
        } catch (error) {
            alert('Error al eliminar el caso');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Cambiar estado del caso
    const handleCambiarEstado = async (nuevoEstado: string) => {
        if (!id) return;

        setLoading(true);
        try {
            const result = await casosService.actualizarCaso(parseInt(id), {
                estado: nuevoEstado,
                fechaActualizacion: new Date().toISOString(),
            });

            if (result.success) {
                // Actualizar el estado local
                setCaso({ ...caso, estado: nuevoEstado });
                setEstadoOriginal(nuevoEstado);
                alert(`Estado del caso actualizado a "${nuevoEstado}" correctamente`);
            } else {
                alert(result.message || 'Error al cambiar el estado del caso');
            }
        } catch (error) {
            alert('Error al cambiar el estado del caso');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="caso-form-container">
            <div className="caso-form-header">
                <h2>{getTitle()}</h2>
            </div>

            <div className="caso-form-card">
                {loading && !caso.titulo ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <form>
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label className="form-label">Título *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                                    value={caso.titulo}
                                    onChange={(e) => setCaso({ ...caso, titulo: e.target.value })}
                                    disabled={modoDetalle}
                                    required
                                />
                                {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                                    value={caso.descripcion || ''}
                                    onChange={(e) => setCaso({ ...caso, descripcion: e.target.value })}
                                    disabled={modoDetalle}
                                    rows={5}
                                    placeholder="Ingrese la descripción del caso"
                                />
                                {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Fiscal *</label>
                                <select
                                    className={`form-select ${errors.FiscalId ? 'is-invalid' : ''}`}
                                    value={caso.FiscalId}
                                    onChange={(e) => setCaso({ ...caso, FiscalId: parseInt(e.target.value) })}
                                    disabled={modoDetalle}
                                    required
                                >
                                    <option value="">Seleccione un fiscal</option>
                                    {fiscales.map((fiscal) => (
                                        <option key={fiscal.id} value={fiscal.id}>
                                            {fiscal.nombre} - {fiscal.rol}
                                        </option>
                                    ))}
                                </select>
                                {errors.FiscalId && <div className="invalid-feedback">{errors.FiscalId}</div>}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Estado *</label>
                                <select
                                    className={`form-select ${errors.estado ? 'is-invalid' : ''}`}
                                    value={caso.estado}
                                    onChange={(e) => setCaso({ ...caso, estado: e.target.value })}
                                    disabled={modoDetalle || modoEdicion}
                                    required
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="EnProgreso">En Progreso</option>
                                    <option value="Cerrado">Cerrado</option>
                                    <option value="Archivado">Archivado</option>
                                </select>
                                {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Prioridad *</label>
                                <select
                                    className={`form-select ${errors.prioridad ? 'is-invalid' : ''}`}
                                    value={caso.prioridad}
                                    onChange={(e) => setCaso({ ...caso, prioridad: e.target.value })}
                                    disabled={modoDetalle}
                                    required
                                >
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                                {errors.prioridad && <div className="invalid-feedback">{errors.prioridad}</div>}
                            </div>
                        </div>

                        {/* Botones de cambio de estado */}
                        {(modoEdicion || modoDetalle) && caso.estado && (
                            <div className="caso-estado-actions mb-4">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5 className="mb-0">
                                            <i className="fas fa-exchange-alt me-2"></i>
                                            Cambiar Estado del Caso
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        {caso.estado === 'Pendiente' && (
                                            <button
                                                type="button"
                                                className="btn btn-info"
                                                onClick={() => handleCambiarEstado('EnProgreso')}
                                                disabled={loading}
                                            >
                                                <i className="fas fa-play me-2"></i>
                                                Solicitar Progreso de Caso
                                            </button>
                                        )}

                                        {caso.estado === 'EnProgreso' && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn btn-success me-2"
                                                    onClick={() => handleCambiarEstado('Cerrado')}
                                                    disabled={loading}
                                                >
                                                    <i className="fas fa-check-circle me-2"></i>
                                                    Cerrar Caso
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    onClick={() => handleCambiarEstado('Pendiente')}
                                                    disabled={loading}
                                                >
                                                    <i className="fas fa-undo me-2"></i>
                                                    Regresar a Pendiente
                                                </button>
                                            </>
                                        )}

                                        {caso.estado === 'Cerrado' && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => handleCambiarEstado('Archivado')}
                                                disabled={loading}
                                            >
                                                <i className="fas fa-archive me-2"></i>
                                                Archivar Caso
                                            </button>
                                        )}

                                        {caso.estado === 'Archivado' && (
                                            <p className="text-muted mb-0">
                                                <i className="fas fa-info-circle me-2"></i>
                                                Este caso está archivado y no puede cambiar de estado.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="caso-form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/casos')}
                                disabled={loading}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Regresar
                            </button>

                            {modoEdicion && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleEliminar}
                                    disabled={loading}
                                >
                                    <i className="fas fa-trash me-2"></i>
                                    Eliminar
                                </button>
                            )}

                            {modoDetalle && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/casos/editar/${id}`)}
                                    disabled={loading}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Editar
                                </button>
                            )}

                            {(modoCreacion || modoEdicion) && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleGuardar}
                                    disabled={loading}
                                >
                                    <i className="fas fa-save me-2"></i>
                                    Guardar
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

