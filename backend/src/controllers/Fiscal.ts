import { Request, Response } from 'express';
import { Fiscal, IFiscal } from '../models/Fiscal';

export class FiscalController {
    // GET /fiscales
    async obtenerTodos(req: Request, res: Response){
        try {
            const fiscaliaId = req.query.fiscaliaId ? parseInt(req.query.fiscaliaId as string) : undefined;
            const estado = req.query.estado ? req.query.estado === 'true' : undefined;

            const fiscales = await Fiscal.getAll(fiscaliaId, estado);
            res.status(200).send({
                success: true,
                data: fiscales,
                count: fiscales.length
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al obtener fiscales',
                error: (error as Error).message
            });
        }
    }

    // GET /fiscales/:id
    async obtenerRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const fiscal = await Fiscal.getById(parseInt(id));

            if (!fiscal) {
                res.status(404).send({
                    success: false,
                    message: 'Fiscal no encontrado'
                });
                return;
            }

            res.status(200).send({
                success: true,
                data: fiscal
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al obtener fiscal',
                error: (error as Error).message
            });
        }
    }

    // POST /fiscales
    async crearRegistro(req: Request, res: Response): Promise<void> {
        try {
            const fiscalData: Omit<IFiscal, 'id'> = {
                ...req.body,
                fechaCreacion: new Date()
            };

            // Validaciones básicas
            if (!fiscalData.nombre || !fiscalData.email || !fiscalData.password) {
                res.status(400).send({
                    success: false,
                    message: 'Nombre, email y password son requeridos'
                });
                return;
            }

            const result = await Fiscal.create(fiscalData);

            res.status(201).send({
                success: true,
                message: 'Fiscal creado exitosamente',
                data: result
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al crear fiscal',
                error: (error as Error).message
            });
        }
    }

    // PUT /fiscales/:id
    async actualizarRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await Fiscal.update(parseInt(id), req.body);

            res.status(200).send({
                success: true,
                message: 'Fiscal actualizado correctamente'
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al actualizar fiscal',
                error: (error as Error).message
            });
        }
    }

    // DELETE /fiscales/:id
    async eliminarRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await Fiscal.delete(parseInt(id));

            res.status(200).send({
                success: true,
                message: 'Fiscal desactivado correctamente'
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al eliminar fiscal',
                error: (error as Error).message
            });
        }
    }
};