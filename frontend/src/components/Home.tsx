import './Home.css';

interface HomeProps {
    userName?: string;
    userRole?: string;
}

export default function Home({ userName, userRole }: HomeProps) {
    return (
        <div className="home-container">
            <div className="welcome-section">
                <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-home me-3 text-primary" style={{ fontSize: '2.5rem' }}></i>
                    <h1 className="mb-0">
                        Panel Principal
                    </h1>
                </div>
                <p className="lead mb-2">
                    Bienvenido, <strong>{userName || 'Usuario'}</strong>
                </p>
                <p className="text-muted mb-0">
                    Rol: <strong>{userRole || 'N/A'}</strong>
                </p>
            </div>
        </div>
    );
}

