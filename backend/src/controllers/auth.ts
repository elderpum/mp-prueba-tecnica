import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Auth, IFiscalLogin } from '../models/auth';

export class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validaciones básicas
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
                return;
            }

            // Verificar credenciales
            const fiscal = await Auth.verificarCredenciales(email, password);

            if (!fiscal) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
                return;
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: fiscal.id,
                    email: fiscal.email,
                    nombre: fiscal.nombre,
                    rol: fiscal.rol,
                    fiscaliaId: fiscal.FiscaliaId
                },
                process.env.JWT_SECRET || 'mp-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login exitoso',
                token: token,
                user: {
                    id: fiscal.id,
                    nombre: fiscal.nombre,
                    email: fiscal.email,
                    rol: fiscal.rol,
                    fiscaliaId: fiscal.FiscaliaId
                }
            });

        } catch (error) {
            console.error('Error en login:', error);

            if ((error as Error).message === 'Usuario desactivado') {
                res.status(401).json({
                    success: false,
                    message: 'Usuario desactivado'
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Error en el servidor',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    }

    async verificarToken(req: Request, res: Response): Promise<void> {
        try {
            // El middleware ya validó el token, solo devolver info del usuario
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Token no proporcionado'
                });
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mp-secret-key') as any;

            // Obtener información actualizada del usuario
            const fiscal = await Auth.obtenerPorId(decoded.id);

            if (!fiscal) {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
                return;
            }

            res.json({
                success: true,
                user: {
                    id: fiscal.id,
                    nombre: fiscal.nombre,
                    email: fiscal.email,
                    rol: fiscal.rol,
                    fiscaliaId: fiscal.FiscaliaId
                }
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }
}