import { Request, Response } from 'express';
import { BitacoraCaso, IBitacoraCaso } from '../models/BitacoraCaso';

export class BitacoraCasoController {
    // GET /bitacoras
        async obtenerTodos(req: Request, res: Response){
            try {
                const fiscalId = req.query.fiscalId ? parseInt(req.query.fiscalId as string) : undefined;
                const casoId = req.query.casoId ? parseInt(req.query.casoId as string) : undefined;
    
                const casos = await BitacoraCaso.getAll(casoId, fiscalId);
                res.status(200).send({
                    success: true,
                    data: casos,
                    count: casos.length
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: 'Error al obtener bitacoras',
                    error: (error as Error).message
                });
            }
        }
    
        // GET /bitacoras/:id
        async obtenerRegistro(req: Request, res: Response): Promise<void> {
            try {
                const { id } = req.params;
                const bitacora = await BitacoraCaso.getById(parseInt(id));
                if (!bitacora) {
                    res.status(404).send({
                        success: false,
                        message: 'Bitacora no encontrada'
                    });
                    return;
                }
    
                res.status(200).send({
                    success: true,
                    data: bitacora
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: 'Error al obtener bitacora',
                    error: (error as Error).message
                });
            }
        }
    
        // POST /bitacoras
        async crearRegistro(req: Request, res: Response): Promise<void> {
            try {
                const bitacoraData: Omit<IBitacoraCaso, 'id'> = {
                    ...req.body,
                    fechaAccion: new Date()
                };
    
                const result = await BitacoraCaso.create(bitacoraData);
    
                res.status(201).send({
                    success: true,
                    message: 'Bitacora creada exitosamente',
                    data: result
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: 'Error al crear bitacora',
                    error: (error as Error).message
                });
            }
        }
    
        // PUT /bitacoras/:id
        async actualizarRegistro(req: Request, res: Response): Promise<void> {
            try {
                const { id } = req.params;
                await BitacoraCaso.update(parseInt(id), req.body);
                res.status(200).send({
                    success: true,
                    message: 'Bitacora actualizada correctamente'
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: 'Error al actualizar caso',
                    error: (error as Error).message
                });
            }
        }
    
        // DELETE /bitacoras/:id
        async eliminarRegistro(req: Request, res: Response): Promise<void> {
            try {
                const { id } = req.params;
                await BitacoraCaso.delete(parseInt(id));
                res.status(200).send({
                    success: true,
                    message: 'Bitacora desactivada correctamente'
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: 'Error al eliminar bitacora',
                    error: (error as Error).message
                });
            }
        }
}