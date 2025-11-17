import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fiscaliasService, type Fiscalia } from '../services/fiscaliasService';
import './FiscaliaForm.css';

export default function FiscaliaForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determinar el modo según la ruta
    const pathSegments = location.pathname.split('/');
    const modoCreacion = pathSegments.includes('nuevo');
    const modoEdicion = pathSegments.includes('editar');
    const modoDetalle = pathSegments.includes('detalle');

    const [loading, setLoading] = useState(false);
    const [fiscalia, setFiscalia] = useState<Fiscalia>({
        id: 0,
        nombre: '',
        direccion: '',
        telefono: '',
        estado: true,
        fechaCreacion: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Obtener título según el modo
    const getTitle = () => {
        if (modoCreacion) return 'Agregar nueva fiscalía';
        if (modoEdicion) return 'Editar fiscalía';
        if (modoDetalle) return 'Detalle de fiscalía';
        return 'Fiscalía';
    };

    // Cargar datos de la fiscalía
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            
            // Cargar fiscalía si es edición o detalle
            if ((modoEdicion || modoDetalle) && id) {
                const fiscaliaResult = await fiscaliasService.obtenerFiscaliaPorId(parseInt(id));
                if (fiscaliaResult.success && fiscaliaResult.data) {
                    setFiscalia(fiscaliaResult.data);
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

        if (!fiscalia.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es requerido';
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Guardar fiscalía
    const handleGuardar = async () => {
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);

        try {
            let result;
            if (modoCreacion) {
                result = await fiscaliasService.crearFiscalia({
                    nombre: fiscalia.nombre,
                    direccion: fiscalia.direccion || undefined,
                    telefono: fiscalia.telefono || undefined,
                    estado: fiscalia.estado,
                    fechaCreacion: new Date().toISOString(),
                });
            } else if (modoEdicion && id) {
                const updateData: Partial<Fiscalia> = {
                    nombre: fiscalia.nombre,
                    direccion: fiscalia.direccion || undefined,
                    telefono: fiscalia.telefono || undefined,
                    estado: fiscalia.estado,
                };
                result = await fiscaliasService.actualizarFiscalia(parseInt(id), updateData);
            }

            if (result?.success) {
                navigate('/fiscalias');
            } else {
                alert(result?.message || 'Error al guardar la fiscalía');
            }
        } catch (error) {
            alert('Error al guardar la fiscalía');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar fiscalía
    const handleEliminar = async () => {
        if (!id) return;
        
        if (!window.confirm('¿Está seguro de que desea desactivar esta fiscalía?')) {
            return;
        }

        setLoading(true);
        try {
            const result = await fiscaliasService.eliminarFiscalia(parseInt(id));
            if (result.success) {
                alert(result.message || 'Fiscalía desactivada correctamente');
                navigate('/fiscalias');
            } else {
                alert(result.message || 'Error al eliminar la fiscalía');
            }
        } catch (error) {
            alert('Error al eliminar la fiscalía');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Reactivar fiscalía
    const handleReactivar = async () => {
        if (!id) return;
        
        if (!window.confirm('¿Está seguro de que desea reactivar esta fiscalía?')) {
            return;
        }

        setLoading(true);
        try {
            const result = await fiscaliasService.actualizarFiscalia(parseInt(id), { estado: true });
            if (result.success) {
                // Actualizar el estado local
                setFiscalia({ ...fiscalia, estado: true });
                alert('Fiscalía reactivada correctamente');
                navigate('/fiscalias');
            } else {
                alert(result.message || 'Error al reactivar la fiscalía');
            }
        } catch (error) {
            alert('Error al reactivar la fiscalía');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fiscalia-form-container">
            <div className="fiscalia-form-header">
                <h2>{getTitle()}</h2>
            </div>

            <div className="fiscalia-form-card">
                {loading && !fiscalia.nombre ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <form>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Nombre *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                    value={fiscalia.nombre}
                                    onChange={(e) => setFiscalia({ ...fiscalia, nombre: e.target.value })}
                                    disabled={modoDetalle}
                                    required
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                                    value={fiscalia.telefono || ''}
                                    onChange={(e) => setFiscalia({ ...fiscalia, telefono: e.target.value })}
                                    disabled={modoDetalle}
                                    placeholder="Ej: 2250-5000"
                                />
                                {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label className="form-label">Dirección</label>
                                <textarea
                                    className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                                    value={fiscalia.direccion || ''}
                                    onChange={(e) => setFiscalia({ ...fiscalia, direccion: e.target.value })}
                                    disabled={modoDetalle}
                                    rows={3}
                                    placeholder="Ingrese la dirección completa"
                                />
                                {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            {(modoEdicion || modoDetalle) && (
                                <div className="col-md-6">
                                    <label className="form-label">Estado</label>
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={fiscalia.estado}
                                            onChange={(e) => setFiscalia({ ...fiscalia, estado: e.target.checked })}
                                            disabled={modoDetalle || modoEdicion}
                                        />
                                        <label className="form-check-label">
                                            {fiscalia.estado ? 'Activo' : 'Inactivo'}
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="fiscalia-form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/fiscalias')}
                                disabled={loading}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Regresar
                            </button>

                            {modoEdicion && (
                                <>
                                    {!fiscalia.estado && (
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleReactivar}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-check me-2"></i>
                                            Reactivar
                                        </button>
                                    )}
                                    {fiscalia.estado && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={handleEliminar}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-trash me-2"></i>
                                            Desactivar
                                        </button>
                                    )}
                                </>
                            )}

                            {modoDetalle && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/fiscalias/editar/${id}`)}
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

