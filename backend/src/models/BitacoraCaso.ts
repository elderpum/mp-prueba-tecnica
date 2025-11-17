import { getConnection, sql } from "../config/database";

export interface IBitacoraCaso {
    id: number;
    accion: string;
    descripcion: string;
    fechaAccion: Date;

    // Relaciones
    CasoId: number;
    FiscalId: number;
}

export class BitacoraCaso {
    // GET /bitacoras - Usa SP_BitacoraCaso_Get
    static async getAll(casoId?: number, fiscalId?: number): Promise<IBitacoraCaso[]> {
        const pool = await getConnection();
        const request = pool.request();
        if (casoId) request.input('casoId', sql.Int, casoId);
        if (fiscalId) request.input('fiscalId', sql.Int, fiscalId);
        const result = await request.execute('SP_BitacoraCaso_Get');
        return result.recordset as IBitacoraCaso[];
    }

    // GET /bitacoras/:id - Usa SP_BitacoraCaso_GetById
    static async getById(id: number): Promise<IBitacoraCaso | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_BitacoraCaso_GetById');
        const bitacora = result.recordset[0];
        return bitacora ? (bitacora as IBitacoraCaso) : null;
    }

    // POST /bitacoras - Usa SP_BitacoraCaso_Insert
    static async create(bitacoraData: Omit<IBitacoraCaso, 'id'>): Promise<{ id: number }> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('accion', sql.NVarChar(255), bitacoraData.accion)
            .input('descripcion', sql.NVarChar(sql.MAX), bitacoraData.descripcion)
            .input('fechaAccion', sql.DateTime, bitacoraData.fechaAccion)
            .input('casoId', sql.Int, bitacoraData.CasoId)
            .input('fiscalId', sql.Int, bitacoraData.FiscalId)
            .execute('SP_BitacoraCaso_Insert');
        return result.recordset[0] as { id: number };
    }

    // PUT /bitacoras/:id - Usa SP_BitacoraCaso_Update
    static async update(id: number, bitacoraData: Partial<IBitacoraCaso>): Promise<void> {
        const pool = await getConnection();
        const request = pool.request().input('id', sql.Int, id);
        if (bitacoraData.accion) request.input('accion', sql.NVarChar(255), bitacoraData.accion);
        if (bitacoraData.descripcion) request.input('descripcion', sql.NVarChar(sql.MAX), bitacoraData.descripcion);
        if (bitacoraData.fechaAccion) request.input('fechaAccion', sql.DateTime, bitacoraData.fechaAccion);
        if (bitacoraData.CasoId) request.input('casoId', sql.Int, bitacoraData.CasoId);
        if (bitacoraData.FiscalId) request.input('fiscalId', sql.Int, bitacoraData.FiscalId);
        await request.execute('SP_BitacoraCaso_Update');
    }

    // DELETE /bitacoras/:id - Usa SP_BitacoraCaso_Delete
    static async delete(id: number): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_BitacoraCaso_Delete');
    }
}