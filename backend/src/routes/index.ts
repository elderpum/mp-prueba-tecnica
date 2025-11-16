import { Router } from "express";

export const routes = Router();

// Rutas requeridas
import { FiscalRoute } from "./Fiscal";
import { FiscaliaRoute } from "./Fiscalia";
import { CasoRoute } from "./Caso";
import { BitacoraCasoRoute } from "./BitacoraCaso";
import { LogReasignacionFallidaRoute } from "./LogReasignacionFallida";
import { AuthRoute } from "./auth";

// Uso de las rutas
routes.use('/auth', AuthRoute);
routes.use('/fiscales', FiscalRoute);
routes.use('/fiscalias', FiscaliaRoute);
routes.use('/casos', CasoRoute);
routes.use('/bitacoras', BitacoraCasoRoute);
routes.use('/logs-reasignacion', LogReasignacionFallidaRoute);