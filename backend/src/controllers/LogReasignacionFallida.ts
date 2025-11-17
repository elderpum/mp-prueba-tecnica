import { Request, Response } from 'express';
import { LogReasignacionFallida, ILogReasignacionFallida } from '../models/LogReasignacionFallida';

export class LogReasignacionFallidaController {
    // GET /logs-reasignacion
    async obtenerTodos(req: Request, res: Response) {
        try {
            const casoId = req.query.casoId ? parseInt(req.query.casoId as string) : undefined;
            const fiscalOrigenId = req.query.fiscalOrigenId ? parseInt(req.query.fiscalOrigenId as string) : undefined;
            const fiscalDestinoId = req.query.fiscalDestinoId ? parseInt(req.query.fiscalDestinoId as string) : undefined;
            const fechaInicio = req.query.fechaInicio ? new Date(req.query.fechaInicio as string) : undefined;
            const fechaFin = req.query.fechaFin ? new Date(req.query.fechaFin as string) : undefined;

            const logs = await LogReasignacionFallida.getAll(
                casoId, 
                fiscalOrigenId, 
                fiscalDestinoId,
                fechaInicio,
                fechaFin
            );
            
            res.status(200).send({
                success: true,
                data: logs,
                count: logs.length
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al obtener logs de reasignación',
                error: (error as Error).message
            });
        }
    }

    // GET /logs-reasignacion/:id
    async obtenerRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const log = await LogReasignacionFallida.getById(parseInt(id));
            
            if (!log) {
                res.status(404).send({
                    success: false,
                    message: 'Log de reasignación no encontrado'
                });
                return;
            }

            res.status(200).send({
                success: true,
                data: log
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al obtener log de reasignación',
                error: (error as Error).message
            });
        }
    }

    // POST /logs-reasignacion
    async crearRegistro(req: Request, res: Response): Promise<void> {
        try {
            const logData: Omit<ILogReasignacionFallida, 'id'> = {
                ...req.body,
                fechaIntento: req.body.fechaIntento ? new Date(req.body.fechaIntento) : new Date()
            };

            // Validaciones básicas
            if (!logData.CasoId || !logData.FiscalOrigenId || !logData.FiscalDestinoId || !logData.motivoBloqueo) {
                res.status(400).send({
                    success: false,
                    message: 'CasoId, FiscalOrigenId, FiscalDestinoId y motivoBloqueo son requeridos'
                });
                return;
            }

            const result = await LogReasignacionFallida.create(logData);

            res.status(201).send({
                success: true,
                message: 'Log de reasignación creado exitosamente',
                data: result
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al crear log de reasignación',
                error: (error as Error).message
            });
        }
    }

    // GET /logs-reasignacion/reporte/fiscalia
    async obtenerReporteFiscalia(req: Request, res: Response): Promise<void> {
        try {
            const fiscaliaId = req.query.fiscaliaId ? parseInt(req.query.fiscaliaId as string) : undefined;
            const fechaInicio = req.query.fechaInicio ? new Date(req.query.fechaInicio as string) : undefined;
            const fechaFin = req.query.fechaFin ? new Date(req.query.fechaFin as string) : undefined;

            const reporte = await LogReasignacionFallida.getReporteFiscalia(
                fiscaliaId,
                fechaInicio,
                fechaFin
            );

            res.status(200).send({
                success: true,
                data: reporte,
                count: reporte.length
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al obtener reporte de reasignaciones por fiscalía',
                error: (error as Error).message
            });
        }
    }
}

