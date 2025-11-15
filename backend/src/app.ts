import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares básicos para la aplicación
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
    res.send('API is healthy');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});

export default app;