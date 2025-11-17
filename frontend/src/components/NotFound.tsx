import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h1 className="not-found-code">404</h1>
                <h2 className="not-found-title">Página no encontrada</h2>
                <p className="not-found-message">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>
                <button 
                    className="btn btn-primary not-found-button"
                    onClick={() => navigate('/home')}
                >
                    <i className="fas fa-home me-2"></i>
                    Ir a inicio
                </button>
            </div>
        </div>
    );
}

