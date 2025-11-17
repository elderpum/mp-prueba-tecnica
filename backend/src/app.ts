import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { routes } from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares básicos para la aplicación
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uso de las rutas
app.use('/api', routes);

// Conectar a la base de datos al iniciar el servidor
connectDB()
    .then(() => {
        console.log('Base de datos conectada - Iniciando servidor...');
    })
    .catch((error) => {
        console.error('Error crítico - No se pudo conectar a la BD:', error);
        process.exit(1);
    });

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
    res.send('API is healthy');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Ruta no encontrada
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});

export default app;