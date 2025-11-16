import { getConnection, sql } from "../config/database";

export interface IFiscal {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: string;
    estado: boolean;
    fechaCreacion: Date;

    // Relaciones
    FiscaliaId: number;
}

export class Fiscal {
    // GET /fiscales - Usa SP_Fiscal_Get
    static async getAll(fiscaliaId?: number, estado?: boolean): Promise<IFiscal[]> {
        const pool = await getConnection();
        const request = pool.request();

        if (fiscaliaId) request.input('fiscaliaId', sql.Int, fiscaliaId);
        if (estado !== undefined) request.input('estado', sql.Bit, estado);

        const result = await request.execute('SP_Fiscal_Get');
        return result.recordset as IFiscal[];
    }

    // GET /fiscales/:id - Usa SP_Fiscal_GetById
    static async getById(id: number): Promise<IFiscal | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_Fiscal_GetById');

        return result.recordset.length > 0 ? result.recordset[0] as IFiscal : null;
    }

    // POST /fiscales - Usa SP_Fiscal_Insert
    static async create(fiscalData: Omit<IFiscal, 'id'>): Promise<{ id: number }> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.NVarChar(255), fiscalData.nombre)
            .input('email', sql.NVarChar(255), fiscalData.email)
            .input('password', sql.NVarChar(255), fiscalData.password)
            .input('rol', sql.NVarChar(255), fiscalData.rol)
            .input('estado', sql.Bit, fiscalData.estado)
            .input('fechaCreacion', sql.DateTime, fiscalData.fechaCreacion)
            .input('fiscaliaId', sql.Int, fiscalData.FiscaliaId)
            .execute('SP_Fiscal_Insert');

        return result.recordset[0] as { id: number };
    }

    // PUT /fiscales/:id - Usa SP_Fiscal_Update
    static async update(id: number, fiscalData: Partial<IFiscal>): Promise<void> {
        const pool = await getConnection();
        const request = pool.request().input('id', sql.Int, id);

        if (fiscalData.nombre) request.input('nombre', sql.NVarChar(255), fiscalData.nombre);
        if (fiscalData.email) request.input('email', sql.NVarChar(255), fiscalData.email);
        if (fiscalData.password) request.input('password', sql.NVarChar(255), fiscalData.password);
        if (fiscalData.rol) request.input('rol', sql.NVarChar(255), fiscalData.rol);
        if (fiscalData.estado !== undefined) request.input('estado', sql.Bit, fiscalData.estado);
        if (fiscalData.FiscaliaId) request.input('fiscaliaId', sql.Int, fiscalData.FiscaliaId);

        await request.execute('SP_Fiscal_Update');
    }

    // DELETE /fiscales/:id - Usa SP_Fiscal_Delete
    static async delete(id: number): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_Fiscal_Delete');
    }
}
