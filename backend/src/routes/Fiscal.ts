import { Router } from "express";
import * as auth from "../middlewares/auth";
import { FiscalController } from "../controllers/Fiscal";

const controller = new FiscalController();
export const FiscalRoute = Router();

FiscalRoute.get('/', auth.autenticarToken, function (req, res) {
    controller.obtenerTodos(req, res);
});

FiscalRoute.get('/:id', auth.autenticarToken, function (req, res) {
    controller.obtenerRegistro(req, res);
});

FiscalRoute.post('/', auth.autenticarToken, function (req, res) {
    controller.crearRegistro(req, res);
});

FiscalRoute.put('/:id', auth.autenticarToken, function (req, res) {
    controller.actualizarRegistro(req, res);
});

FiscalRoute.delete('/:id', auth.autenticarToken, function (req, res) {
    controller.eliminarRegistro(req, res);
});