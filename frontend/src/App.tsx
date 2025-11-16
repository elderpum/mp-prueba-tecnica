import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import FiscalesList from './components/FiscalesList';
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
      <Sidebar />
      
      <div className="app-content">
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

        <Routes>
          <Route path="/home" element={<Home userName={user?.nombre} userRole={user?.rol} />} />
          <Route path="/fiscales" element={<FiscalesList />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
