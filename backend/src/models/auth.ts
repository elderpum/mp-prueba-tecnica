import { getConnection, sql } from '../config/database';
import bcrypt from 'bcryptjs';

export interface IFiscalLogin {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: string;
    estado: boolean;
    FiscaliaId: number;
}

export class Auth {
    // Buscar fiscal por email y verificar contraseña
    static async verificarCredenciales(email: string, password: string): Promise<IFiscalLogin | null> {
        const pool = await getConnection();

        try {
            // Buscar fiscal por email usando el SP específico para autenticación
            const result = await pool.request()
                .input('email', sql.NVarChar(255), email)
                .execute('SP_Fiscal_GetForAuth');

            if (result.recordset.length === 0) {
                return null;
            }

            const fiscal = result.recordset[0] as IFiscalLogin;

            // Verificar que el fiscal esté activo
            if (!fiscal.estado) {
                throw new Error('Usuario desactivado');
            }

            // Verificar que la contraseña exista
            if (!fiscal.password) {
                console.error('Password no encontrado para el usuario:', email);
                return null;
            }

            // Verificar contraseña con bcrypt
            const passwordMatch = await bcrypt.compare(password, fiscal.password);
            if (!passwordMatch) {
                return null;
            }

            // Retornar el fiscal
            return fiscal;
        } catch (error) {
            console.error('Error en verificarCredenciales:', error);
            throw error;
        }
    }

    // Obtener fiscal por ID
    static async obtenerPorId(id: number): Promise<IFiscalLogin | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_Fiscal_GetById');

        return result.recordset.length > 0 ? result.recordset[0] as IFiscalLogin : null;
    }
}