import { Request, Response } from 'express';
import { Caso, ICaso } from '../models/Caso';
import { BitacoraCaso } from '../models/BitacoraCaso';

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
                fechaCreacion: new Date(),
                fechaActualizacion: new Date()
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

            // Crear bitácora de creación
            try {
                await BitacoraCaso.create({
                    CasoId: result.id,
                    FiscalId: casoData.FiscalId,
                    accion: 'Creacion',
                    descripcion: 'Caso creado y asignado al fiscal',
                    fechaAccion: new Date()
                });
            } catch (bitacoraError) {
                console.error('Error al crear bitácora de creación:', bitacoraError);
            }

            res.status(201).send({
                success: true,
                message: 'Caso creado exitosamente',
                data: result
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error al crear caso',
                error: (error as Error).message
            });
        }
    }

    // PUT /casos/:id
    async actualizarRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const casoId = parseInt(id);
            
            // Obtener el caso anterior para comparar el estado
            const casoAnterior = await Caso.getById(casoId);
            if (!casoAnterior) {
                res.status(404).send({
                    success: false,
                    message: 'Caso no encontrado'
                });
                return;
            }

            // Actualizar el caso
            await Caso.update(casoId, req.body);

            // Obtener el caso actualizado para obtener el FiscalId correcto
            const casoActualizado = await Caso.getById(casoId);
            if (!casoActualizado) {
                res.status(500).send({
                    success: false,
                    message: 'Error al obtener caso actualizado'
                });
                return;
            }

            // Usar el FiscalId del caso actualizado
            const fiscalIdDelCaso = casoActualizado.FiscalId;

            // Determinar si cambió el estado
            const nuevoEstado = req.body.estado;
            const estadoCambio = casoAnterior.estado !== nuevoEstado && nuevoEstado !== undefined;

            // Crear bitácora según el tipo de cambio
            try {
                if (estadoCambio) {
                    // Bitácora de cambio de estado
                    await BitacoraCaso.create({
                        CasoId: casoId,
                        FiscalId: fiscalIdDelCaso,
                        accion: 'CambioEstado',
                        descripcion: 'Cambio de Estado en el caso. Por favor revisar',
                        fechaAccion: new Date()
                    });
                } else {
                    // Bitácora de actualización general
                    await BitacoraCaso.create({
                        CasoId: casoId,
                        FiscalId: fiscalIdDelCaso,
                        accion: 'Actualizacion',
                        descripcion: 'Se actualizó información importante del caso. Por favor revisar',
                        fechaAccion: new Date()
                    });
                }
            } catch (bitacoraError) {
                console.error('Error al crear bitácora:', bitacoraError);
            }

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