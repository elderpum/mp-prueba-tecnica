import { getConnection, sql } from "../config/database";

export interface ICaso {
    id: number;
    titulo: string;
    descripcion: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    estado: string;
    prioridad: string;

    // Relaciones
    FiscalId: number;
}

export class Caso {
    // GET /casos - Usa SP_Caso_Get
    static async getAll(fiscalId?: number, estado?: string): Promise<ICaso[]> {
        const pool = await getConnection();
        const request = pool.request();

        if (fiscalId) request.input('fiscalId', sql.Int, fiscalId);
        if (estado) request.input('estado', sql.NVarChar(50), estado);
        const result = await request.execute('SP_Caso_Get');
        return result.recordset as ICaso[];
    }

    // GET /casos/:id - Usa SP_Caso_GetById
    static async getById(id: number): Promise<ICaso | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_Caso_GetById');
        const caso = result.recordset[0];
        return caso ? (caso as ICaso) : null;
    }

    // POST /casos - Usa SP_Caso_Insert
    static async create(casoData: Omit<ICaso, 'id'>): Promise<{ id: number }> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('titulo', sql.NVarChar(255), casoData.titulo)
            .input('descripcion', sql.NVarChar(sql.MAX), casoData.descripcion)
            .input('fechaCreacion', sql.DateTime, casoData.fechaCreacion)
            .input('fechaActualizacion', sql.DateTime, casoData.fechaActualizacion)
            .input('estado', sql.NVarChar(50), casoData.estado)
            .input('prioridad', sql.NVarChar(50), casoData.prioridad)
            .input('fiscalId', sql.Int, casoData.FiscalId)
            .execute('SP_Caso_Insert');
        return result.recordset[0] as { id: number };
    }

    // PUT /casos/:id - Usa SP_Caso_Update
    static async update(id: number, casoData: Partial<ICaso>): Promise<void> {
        const pool = await getConnection();
        const request = pool.request().input('id', sql.Int, id);
        if (casoData.titulo) request.input('titulo', sql.NVarChar(255), casoData.titulo);
        if (casoData.descripcion) request.input('descripcion', sql.NVarChar(sql.MAX), casoData.descripcion);
        if (casoData.fechaActualizacion) request.input('fechaActualizacion', sql.DateTime, casoData.fechaActualizacion);
        if (casoData.estado) request.input('estado', sql.NVarChar(50), casoData.estado);
        if (casoData.prioridad) request.input('prioridad', sql.NVarChar(50), casoData.prioridad);
        await request.execute('SP_Caso_Update');
    }

    // DELETE /casos/:id - Usa SP_Caso_Delete
    static async delete(id: number): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_Caso_Delete');
    }
}