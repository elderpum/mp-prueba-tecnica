import { Router } from "express";
import * as auth from "../middlewares/auth";
import { LogReasignacionFallidaController } from "../controllers/LogReasignacionFallida";

const controller = new LogReasignacionFallidaController();
export const LogReasignacionFallidaRoute = Router();

LogReasignacionFallidaRoute.get('/', auth.autenticarToken, function (req, res) {
    controller.obtenerTodos(req, res);
});

LogReasignacionFallidaRoute.get('/reporte/fiscalia', auth.autenticarToken, function (req, res) {
    controller.obtenerReporteFiscalia(req, res);
});

LogReasignacionFallidaRoute.get('/:id', auth.autenticarToken, function (req, res) {
    controller.obtenerRegistro(req, res);
});

LogReasignacionFallidaRoute.post('/', auth.autenticarToken, function (req, res) {
    controller.crearRegistro(req, res);
});

