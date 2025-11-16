import { Router } from "express";

export const routes = Router();

// Rutas requeridas
import { FiscalRoute } from "./Fiscal";
import { FiscaliaRoute } from "./Fiscalia";
import { AuthRoute } from "./auth";

// Uso de las rutas
routes.use('/auth', AuthRoute);
routes.use('/fiscales', FiscalRoute);
routes.use('/fiscalias', FiscaliaRoute);