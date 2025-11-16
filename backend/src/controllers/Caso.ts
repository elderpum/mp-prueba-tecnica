import { Request, Response } from 'express';
import { Caso, ICaso } from '../models/Caso';

export class CasoController {
    // GET /casos
    async obtenerTodos(req: Request, res: Response){
        try {
            const fiscaliaId = req.query.fiscaliaId ? parseInt(req.query.fiscaliaId as string) : undefined;
            const estado = req.query.estado ? req.query.estado as string : undefined;

            const casos = await Caso.getAll(fiscaliaId, estado);
            res.status(200).send({
                success: true,
                data: casos,
                count: casos.length
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al obtener casos',
                error: (error as Error).message
            });
        }
    }

    // GET /casos/:id
    async obtenerRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const caso = await Caso.getById(parseInt(id));
            if (!caso) {
                res.status(404).send({
                    success: false,
                    message: 'Caso no encontrado'
                });
                return;
            }

            res.status(200).send({
                success: true,
                data: caso
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al obtener caso',
                error: (error as Error).message
            });
        }
    }

    // POST /casos
    async crearRegistro(req: Request, res: Response): Promise<void> {
        try {
            const casoData: Omit<ICaso, 'id'> = {
                ...req.body,
                fechaCreacion: new Date()
            };

            // Validaciones básicas
            if (!casoData.titulo || !casoData.descripcion || !casoData.estado) {
                res.status(400).send({
                    success: false,
                    message: 'Título, descripción y estado son requeridos'
                });
                return;
            }

            const result = await Caso.create(casoData);

            res.status(201).send({
                success: true,
                message: 'Caso creado exitosamente',
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

    // PUT /casos/:id
    async actualizarRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await Caso.update(parseInt(id), req.body);
            res.status(200).send({
                success: true,
                message: 'Caso actualizado correctamente'
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al actualizar caso',
                error: (error as Error).message
            });
        }
    }

    // DELETE /casos/:id
    async eliminarRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await Caso.delete(parseInt(id));
            res.status(200).send({
                success: true,
                message: 'Caso desactivado correctamente'
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al eliminar caso',
                error: (error as Error).message
            });
        }
    }
};