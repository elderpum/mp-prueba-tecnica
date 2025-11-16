import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const autenticarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).send({
                success: false,
                message: 'Token de acceso requerido'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).send({
                success: false,
                message: 'Formato de token inválido'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mp-secret-key');
        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).send({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};