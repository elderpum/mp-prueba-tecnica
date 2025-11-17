import { Router } from "express";
import * as auth from "../middlewares/auth";
import { BitacoraCasoController } from "../controllers/BitacoraCaso";

const controller = new BitacoraCasoController();
export const BitacoraCasoRoute = Router();

BitacoraCasoRoute.get('/', auth.autenticarToken, function (req, res) {
    controller.obtenerTodos(req, res);
});

BitacoraCasoRoute.get('/:id', auth.autenticarToken, function (req, res) {
    controller.obtenerRegistro(req, res);
});

BitacoraCasoRoute.post('/', auth.autenticarToken, function (req, res) {
    controller.crearRegistro(req, res);
});

BitacoraCasoRoute.put('/:id', auth.autenticarToken, function (req, res) {
    controller.actualizarRegistro(req, res);
});

BitacoraCasoRoute.delete('/:id', auth.autenticarToken, function (req, res) {
    controller.eliminarRegistro(req, res);
});