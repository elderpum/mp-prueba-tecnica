import { getConnection, sql } from "../config/database";

export interface IFiscalia {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    estado: boolean;
    fechaCreacion: Date;
}

export class Fiscalia {
    // GET /fiscalias - Usa SP_Fiscalia_Get
    static async getAll(estado?: boolean): Promise<IFiscalia[]> {
        const pool = await getConnection();
        const request = pool.request();

        if (estado !== undefined) request.input('estado', sql.Bit, estado);

        const result = await request.execute('SP_Fiscalia_Get');
        return result.recordset as IFiscalia[];
    }

    // GET /fiscalias/:id - Usa SP_Fiscalia_GetById
    static async getById(id: number): Promise<IFiscalia | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_Fiscalia_GetById');
        return result.recordset.length > 0 ? result.recordset[0] as IFiscalia : null;
    }

    // POST /fiscalias - Usa SP_Fiscalia_Insert
    static async create(fiscaliaData: Omit<IFiscalia, 'id'>): Promise<{ id: number }> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.NVarChar(255), fiscaliaData.nombre)
            .input('direccion', sql.NVarChar(500), fiscaliaData.direccion)
            .input('telefono', sql.NVarChar(50), fiscaliaData.telefono)
            .input('estado', sql.Bit, fiscaliaData.estado)
            .input('fechaCreacion', sql.DateTime, fiscaliaData.fechaCreacion)
            .execute('SP_Fiscalia_Insert');
        return result.recordset[0] as { id: number };
    }

    // PUT /fiscalias/:id - Usa SP_Fiscalia_Update
    static async update(id: number, fiscaliaData: Partial<IFiscalia>): Promise<void> {
        const pool = await getConnection();
        const request = pool.request().input('id', sql.Int, id);
        if (fiscaliaData.nombre) request.input('nombre', sql.NVarChar(255), fiscaliaData.nombre);
        if (fiscaliaData.direccion) request.input('direccion', sql.NVarChar(500), fiscaliaData.direccion);
        if (fiscaliaData.telefono) request.input('telefono', sql.NVarChar(50), fiscaliaData.telefono);
        if (fiscaliaData.estado !== undefined) request.input('estado', sql.Bit, fiscaliaData.estado);
        await request.execute('SP_Fiscalia_Update');
    }

    // DELETE /fiscalias/:id - Usa SP_Fiscalia_Delete
    static async delete(id: number): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_Fiscalia_Delete');
    }
}