import { getConnection, sql } from "../config/database";

export interface ILogReasignacionFallida {
    id: number;
    CasoId: number;
    FiscalOrigenId: number;
    FiscalDestinoId: number;
    motivoBloqueo: string;
    fechaIntento: Date;
}

export class LogReasignacionFallida {
    // GET /logs-reasignacion - Usa SP_LogReasignacion_Get
    static async getAll(
        casoId?: number, 
        fiscalOrigenId?: number, 
        fiscalDestinoId?: number,
        fechaInicio?: Date,
        fechaFin?: Date
    ): Promise<ILogReasignacionFallida[]> {
        const pool = await getConnection();
        const request = pool.request();
        
        if (casoId) request.input('casoId', sql.Int, casoId);
        if (fiscalOrigenId) request.input('fiscalOrigenId', sql.Int, fiscalOrigenId);
        if (fiscalDestinoId) request.input('fiscalDestinoId', sql.Int, fiscalDestinoId);
        if (fechaInicio) request.input('fechaInicio', sql.DateTime, fechaInicio);
        if (fechaFin) request.input('fechaFin', sql.DateTime, fechaFin);
        
        const result = await request.execute('SP_LogReasignacion_Get');
        return result.recordset as ILogReasignacionFallida[];
    }

    // GET /logs-reasignacion/:id - Usa SP_LogReasignacion_GetById
    static async getById(id: number): Promise<ILogReasignacionFallida | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .execute('SP_LogReasignacion_GetById');
        const log = result.recordset[0];
        return log ? (log as ILogReasignacionFallida) : null;
    }

    // POST /logs-reasignacion - Usa SP_LogReasignacion_Insert
    static async create(logData: Omit<ILogReasignacionFallida, 'id'>): Promise<{ id: number }> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('casoId', sql.Int, logData.CasoId)
            .input('fiscalOrigenId', sql.Int, logData.FiscalOrigenId)
            .input('fiscalDestinoId', sql.Int, logData.FiscalDestinoId)
            .input('motivoBloqueo', sql.NVarChar(sql.MAX), logData.motivoBloqueo)
            .input('fechaIntento', sql.DateTime, logData.fechaIntento)
            .execute('SP_LogReasignacion_Insert');
        return result.recordset[0] as { id: number };
    }

    // GET /logs-reasignacion/reporte/fiscalia - Usa SP_LogReasignacion_GetReporteFiscalia
    static async getReporteFiscalia(
        fiscaliaId?: number,
        fechaInicio?: Date,
        fechaFin?: Date
    ): Promise<any[]> {
        const pool = await getConnection();
        const request = pool.request();
        
        if (fiscaliaId) request.input('fiscaliaId', sql.Int, fiscaliaId);
        if (fechaInicio) request.input('fechaInicio', sql.DateTime, fechaInicio);
        if (fechaFin) request.input('fechaFin', sql.DateTime, fechaFin);
        
        const result = await request.execute('SP_LogReasignacion_GetReporteFiscalia');
        return result.recordset;
    }
}

