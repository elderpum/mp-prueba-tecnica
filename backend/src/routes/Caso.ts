import { Router } from "express";
import * as auth from "../middlewares/auth";
import { CasoController } from "../controllers/Caso";

const controller = new CasoController();
export const CasoRoute = Router();

CasoRoute.get('/', auth.autenticarToken, function (req, res) {
    controller.obtenerTodos(req, res);
});

CasoRoute.get('/:id', auth.autenticarToken, function (req, res) {
    controller.obtenerRegistro(req, res);
});

CasoRoute.post('/', auth.autenticarToken, function (req, res) {
    controller.crearRegistro(req, res);
});

CasoRoute.put('/:id', auth.autenticarToken, function (req, res) {
    controller.actualizarRegistro(req, res);
});

CasoRoute.delete('/:id', auth.autenticarToken, function (req, res) {
    controller.eliminarRegistro(req, res);
});