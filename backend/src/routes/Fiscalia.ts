import { Router } from "express";
import * as auth from "../middlewares/auth";
import { FiscaliaController } from "../controllers/Fiscalia";

const controller = new FiscaliaController();
export const FiscaliaRoute = Router();

FiscaliaRoute.get('/', auth.autenticarToken, function (req, res) {
    controller.obtenerTodos(req, res);
});

FiscaliaRoute.get('/:id', auth.autenticarToken, function (req, res) {
    controller.obtenerRegistro(req, res);
});

FiscaliaRoute.post('/', auth.autenticarToken, function (req, res) {
    controller.crearRegistro(req, res);
});

FiscaliaRoute.put('/:id', auth.autenticarToken, function (req, res) {
    controller.actualizarRegistro(req, res);
});

FiscaliaRoute.delete('/:id', auth.autenticarToken, function (req, res) {
    controller.eliminarRegistro(req, res);
});