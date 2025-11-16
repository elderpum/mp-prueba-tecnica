import Login from './components/Login';
import { useAuth } from './hooks/useAuth';
import { apiService } from './services/api';
import './App.css';

function App() {
  const { isAuthenticated, loading, user, login, logout } = useAuth();

  const handleLoginSuccess = () => {
    const currentUser = apiService.getUser();
    if (currentUser) {
      login(currentUser);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="fas fa-balance-scale me-2"></i>
            Ministerio Público
          </a>
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user me-2"></i>
                {user?.nombre || 'Usuario'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">Rol: {user?.rol}</small>
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    <i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">
                  <i className="fas fa-home me-2"></i>Bienvenido
                </h1>
                <p className="card-text">
                  Has iniciado sesión correctamente. Aquí irá el contenido principal de la aplicación.
                </p>
                <p className="text-muted">
                  Usuario: <strong>{user?.nombre}</strong> | Rol: <strong>{user?.rol}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
