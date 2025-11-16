import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fiscalesService, type Fiscal } from '../services/fiscalesService';
import { fiscaliasService, type Fiscalia } from '../services/fiscaliasService';
import './FiscalForm.css';

export default function FiscalForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determinar el modo según la ruta
    const pathSegments = location.pathname.split('/');
    const modoCreacion = pathSegments.includes('nuevo');
    const modoEdicion = pathSegments.includes('editar');
    const modoDetalle = pathSegments.includes('detalle');

    const [loading, setLoading] = useState(false);
    const [fiscalias, setFiscalias] = useState<Fiscalia[]>([]);
    const [fiscal, setFiscal] = useState<Fiscal>({
        id: 0,
        nombre: '',
        email: '',
        password: '',
        rol: 'Fiscal',
        estado: true,
        fechaCreacion: null,
        FiscaliaId: -1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Obtener título según el modo
    const getTitle = () => {
        if (modoCreacion) return 'Agregar nuevo fiscal';
        if (modoEdicion) return 'Editar fiscal';
        if (modoDetalle) return 'Detalle de fiscal';
        return 'Fiscal';
    };

    // Cargar fiscalías y datos del fiscal
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            
            // Cargar fiscalías
            const fiscaliasResult = await fiscaliasService.obtenerFiscalias();
            if (fiscaliasResult.success && fiscaliasResult.data) {
                setFiscalias(fiscaliasResult.data.filter(f => f.estado));
            }

            // Cargar fiscal si es edición o detalle
            if ((modoEdicion || modoDetalle) && id) {
                const fiscalResult = await fiscalesService.obtenerFiscalPorId(parseInt(id));
                if (fiscalResult.success && fiscalResult.data) {
                    setFiscal(fiscalResult.data);
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

        if (!fiscal.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es requerido';
        }

        if (!fiscal.email.trim()) {
            nuevosErrores.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fiscal.email)) {
            nuevosErrores.email = 'El email no es válido';
        }

        // Solo validar password en modo creación
        if (modoCreacion && !fiscal.password) {
            nuevosErrores.password = 'La contraseña es requerida';
        }

        if (!fiscal.rol) {
            nuevosErrores.rol = 'El rol es requerido';
        }

        if (!fiscal.FiscaliaId) {
            nuevosErrores.FiscaliaId = 'La fiscalía es requerida';
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Guardar fiscal
    const handleGuardar = async () => {
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);

        try {
            let result;
            if (modoCreacion) {
                result = await fiscalesService.crearFiscal({
                    nombre: fiscal.nombre,
                    email: fiscal.email,
                    password: fiscal.password || '',
                    rol: fiscal.rol,
                    estado: fiscal.estado,
                    fechaCreacion: new Date().toISOString(),
                    FiscaliaId: fiscal.FiscaliaId,
                });
            } else if (modoEdicion && id) {
                const updateData: Partial<Fiscal> = {
                    nombre: fiscal.nombre,
                    email: fiscal.email,
                    rol: fiscal.rol,
                    estado: fiscal.estado,
                    FiscaliaId: fiscal.FiscaliaId,
                };
                // No enviar password en modo edición (el backend no lo actualizará si no se envía)
                result = await fiscalesService.actualizarFiscal(parseInt(id), updateData);
            }

            if (result?.success) {
                navigate('/fiscales');
            } else {
                alert(result?.message || 'Error al guardar el fiscal');
            }
        } catch (error) {
            alert('Error al guardar el fiscal');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar fiscal
    const handleEliminar = async () => {
        if (!id) return;
        
        if (!window.confirm('¿Está seguro de que desea desactivar este fiscal?')) {
            return;
        }

        setLoading(true);
        try {
            const result = await fiscalesService.eliminarFiscal(parseInt(id));
            if (result.success) {
                alert(result.message || 'Fiscal desactivado correctamente');
                navigate('/fiscales');
            } else {
                alert(result.message || 'Error al eliminar el fiscal');
            }
        } catch (error) {
            alert('Error al eliminar el fiscal');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Reactivar fiscal
    const handleReactivar = async () => {
        if (!id) return;
        
        if (!window.confirm('¿Está seguro de que desea reactivar este fiscal?')) {
            return;
        }

        setLoading(true);
        try {
            const result = await fiscalesService.actualizarFiscal(parseInt(id), { estado: true });
            if (result.success) {
                // Actualizar el estado local
                setFiscal({ ...fiscal, estado: true });
                alert('Fiscal reactivado correctamente');
                navigate('/fiscales');
            } else {
                alert(result.message || 'Error al reactivar el fiscal');
            }
        } catch (error) {
            alert('Error al reactivar el fiscal');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fiscal-form-container">
            <div className="fiscal-form-header">
                <h2>{getTitle()}</h2>
            </div>

            <div className="fiscal-form-card">
                {loading && !fiscal.nombre ? (
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
                                    value={fiscal.nombre}
                                    onChange={(e) => setFiscal({ ...fiscal, nombre: e.target.value })}
                                    disabled={modoDetalle}
                                    required
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={fiscal.email}
                                    onChange={(e) => setFiscal({ ...fiscal, email: e.target.value })}
                                    disabled={modoDetalle}
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            {modoCreacion && (
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Contraseña *
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        value={fiscal.password || ''}
                                        onChange={(e) => setFiscal({ ...fiscal, password: e.target.value })}
                                        disabled={modoDetalle}
                                        required
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>
                            )}

                            <div className="col-md-6">
                                <label className="form-label">Rol *</label>
                                <select
                                    className={`form-select ${errors.rol ? 'is-invalid' : ''}`}
                                    value={fiscal.rol}
                                    onChange={(e) => setFiscal({ ...fiscal, rol: e.target.value })}
                                    disabled={modoDetalle}
                                    required
                                >
                                    <option value="">Seleccione un rol</option>
                                    <option value="Fiscal">Fiscal</option>
                                    <option value="Fiscal Jefe">Fiscal Jefe</option>
                                </select>
                                {errors.rol && <div className="invalid-feedback">{errors.rol}</div>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Fiscalía *</label>
                                <select
                                    className={`form-select ${errors.FiscaliaId ? 'is-invalid' : ''}`}
                                    value={fiscal.FiscaliaId}
                                    onChange={(e) => setFiscal({ ...fiscal, FiscaliaId: parseInt(e.target.value) })}
                                    disabled={modoDetalle}
                                    required
                                >
                                    <option value="">Seleccione una fiscalía</option>
                                    {fiscalias.map((fiscalia) => (
                                        <option key={fiscalia.id} value={fiscalia.id}>
                                            {fiscalia.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.FiscaliaId && <div className="invalid-feedback">{errors.FiscaliaId}</div>}
                            </div>

                            {(modoEdicion || modoDetalle) && (
                                <div className="col-md-6">
                                    <label className="form-label">Estado</label>
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={fiscal.estado}
                                            onChange={(e) => setFiscal({ ...fiscal, estado: e.target.checked })}
                                            disabled={modoDetalle || modoEdicion}
                                        />
                                        <label className="form-check-label">
                                            {fiscal.estado ? 'Activo' : 'Inactivo'}
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="fiscal-form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/fiscales')}
                                disabled={loading}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Regresar
                            </button>

                            {modoEdicion && (
                                <>
                                    {!fiscal.estado && (
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
                                    {fiscal.estado && (
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
                                    onClick={() => navigate(`/fiscales/editar/${id}`)}
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

