import { Request, Response } from 'express';
import { Fiscalia, IFiscalia } from '../models/Fiscalia';

export class FiscaliaController {
    // GET /fiscalias
    async obtenerTodos(req: Request, res: Response){
        try {
            const estado = req.query.estado ? req.query.estado === 'true' : undefined;
            const fiscalias = await Fiscalia.getAll(estado);
            res.status(200).send({
                success: true,
                data: fiscalias,
                count: fiscalias.length
            });
        } catch (error) {
            res.status(500).send({ message: 'Error al obtener las fiscalías', error });
        }
    }

    // GET /fiscalias/:id
    async obtenerRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const fiscalia = await Fiscalia.getById(parseInt(id));

            if (!fiscalia) {
                res.status(404).send({
                    success: false,
                    message: 'Fiscalía no encontrada'
                });
                return;
            }

            res.status(200).send({
                success: true,
                data: fiscalia
            });
        } catch (error) {
            res.status(500).send({ message: 'Error al obtener la fiscalía', error });
        }
    }

    // POST /fiscalias
    async crearRegistro(req: Request, res: Response): Promise<void> {
        try {
            const fiscaliaData: Omit<IFiscalia, 'id'> = {
                ...req.body,
                fechaCreacion: new Date()
            };
            const nuevoFiscalia = await Fiscalia.create(fiscaliaData);
            res.status(201).send(nuevoFiscalia);
        } catch (error) {
            res.status(500).send({ message: 'Error al crear la fiscalía', error });
        }
    }

    // PUT /fiscalias/:id
    async actualizarRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const fiscaliaData: Partial<IFiscalia> = req.body;
            await Fiscalia.update(parseInt(id), fiscaliaData);
            res.send({ message: 'Fiscalía actualizada correctamente' });
        } catch (error) {
            res.status(500).send({ message: 'Error al actualizar la fiscalía', error });
        }
    }

    // DELETE /fiscalias/:id
    async eliminarRegistro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await Fiscalia.delete(parseInt(id));
            res.send({ message: 'Fiscalía eliminada correctamente' });
        } catch (error) {
            res.status(500).send({ message: 'Error al eliminar la fiscalía', error });
        }
    }
}