-- SP para Obtener Fiscalías
CREATE OR ALTER PROCEDURE SP_Fiscalia_Get
    @id INT = NULL,
    @nombre NVARCHAR(255) = NULL,
    @estado BIT = NULL
AS
BEGIN
    SELECT
        id, nombre, estado, direccion, telefono, fechaCreacion
    FROM Fiscalia
    WHERE (@id IS NULL OR id = @id)
        AND (@nombre IS NULL OR nombre = @nombre)
        AND (@estado IS NULL OR estado = @estado)
    ORDER BY nombre;
END
GO

-- SP para obtener Fiscalía por Id
CREATE OR ALTER PROCEDURE SP_Fiscalia_GetById
    @id INT
AS
BEGIN
    SELECT
        id, nombre, estado, direccion, telefono, fechaCreacion
    FROM Fiscalia
    WHERE id = @id;
END
GO

-- SP para Insertar Fiscalía
CREATE OR ALTER PROCEDURE SP_Fiscalia_Insert
    @nombre NVARCHAR(255),
    @direccion NVARCHAR(255) = NULL,
    @telefono NVARCHAR(50) = NULL,
    @estado BIT,
    @fechaCreacion DATETIME
AS
BEGIN
    INSERT INTO Fiscalia (nombre, direccion, telefono, estado, fechaCreacion)
    VALUES (@nombre, @direccion, @telefono, @estado, @fechaCreacion);

    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- SP para Actualizar Fiscalía
CREATE OR ALTER PROCEDURE SP_Fiscalia_Update
    @id INT,
    @nombre NVARCHAR(255) = NULL,
    @direccion NVARCHAR(255) = NULL,
    @telefono NVARCHAR(50) = NULL,
    @estado BIT = NULL
AS
BEGIN
    UPDATE Fiscalia
    SET nombre = ISNULL(@nombre, nombre),
        direccion = ISNULL(@direccion, direccion),
        telefono = ISNULL(@telefono, telefono),
        estado = ISNULL(@estado, estado)
    WHERE id = @id;

    SELECT 'Actualizado correctamente' AS resultado;
END
GO

-- SP para Eliminar Fiscalía (lógico)
CREATE OR ALTER PROCEDURE SP_Fiscalia_Delete
    @id INT
AS
BEGIN
    UPDATE Fiscalia SET estado = 0 WHERE id = @id;
    SELECT 'Fiscalía desactivada correctamente' AS resultado;
END
GO

-- SP para Obtener Fiscales
CREATE OR ALTER PROCEDURE SP_Fiscal_Get
    @id INT = NULL,
    @email NVARCHAR(255) = NULL,
    @fiscaliaId INT = NULL,
    @estado BIT = NULL
AS
BEGIN
    SELECT 
        id, nombre, email, rol, estado, fechaCreacion, FiscaliaId
    FROM Fiscal
    WHERE (@id IS NULL OR id = @id)
        AND (@email IS NULL OR email = @email)
        AND (@fiscaliaId IS NULL OR FiscaliaId = @fiscaliaId)
        AND (@estado IS NULL OR estado = @estado)
    ORDER BY nombre;
END
GO

-- SP para Autenticación (incluye password para verificación)
CREATE OR ALTER PROCEDURE SP_Fiscal_GetForAuth
    @email NVARCHAR(255)
AS
BEGIN
    SELECT 
        id, nombre, email, password, rol, estado, fechaCreacion, FiscaliaId
    FROM Fiscal
    WHERE email = @email;
END
GO

-- SP para obtener Fiscal por Id
CREATE OR ALTER PROCEDURE SP_Fiscal_GetById
    @id INT
AS
BEGIN
    SELECT 
        id, nombre, email, rol, estado, fechaCreacion, FiscaliaId
    FROM Fiscal
    WHERE id = @id;
END
GO

-- SP para Insertar Fiscal
CREATE OR ALTER PROCEDURE SP_Fiscal_Insert
    @nombre NVARCHAR(255),
    @email NVARCHAR(255),
    @password NVARCHAR(255),
    @rol NVARCHAR(255),
    @estado BIT,
    @fechaCreacion DATETIME,
    @fiscaliaId INT
AS
BEGIN
    INSERT INTO Fiscal (nombre, email, password, rol, estado, fechaCreacion, FiscaliaId)
    VALUES (@nombre, @email, @password, @rol, @estado, @fechaCreacion, @fiscaliaId);
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- SP para Actualizar Fiscal
CREATE OR ALTER PROCEDURE SP_Fiscal_Update
    @id INT,
    @nombre NVARCHAR(255) = NULL,
    @email NVARCHAR(255) = NULL,
    @password NVARCHAR(255) = NULL,
    @rol NVARCHAR(255) = NULL,
    @estado BIT = NULL,
    @fiscaliaId INT = NULL
AS
BEGIN
    UPDATE Fiscal 
    SET nombre = ISNULL(@nombre, nombre),
        email = ISNULL(@email, email),
        password = ISNULL(@password, password),
        rol = ISNULL(@rol, rol),
        estado = ISNULL(@estado, estado),
        FiscaliaId = ISNULL(@fiscaliaId, FiscaliaId)
    WHERE id = @id;
    
    SELECT 'Actualizado correctamente' AS resultado;
END
GO

-- SP para Eliminar Fiscal (lógico)
CREATE OR ALTER PROCEDURE SP_Fiscal_Delete
    @id INT
AS
BEGIN
    UPDATE Fiscal SET estado = 0 WHERE id = @id;
    SELECT 'Fiscal desactivado correctamente' AS resultado;
END
GO

-- SP para obtener Casos
CREATE OR ALTER PROCEDURE SP_Caso_Get
    @id INT = NULL,
    @fiscalId INT = NULL,
    @estado NVARCHAR(255) = NULL,
    @prioridad NVARCHAR(255) = NULL
AS
BEGIN
    SELECT 
        id, titulo, descripcion, fechaCreacion, fechaActualizacion, 
        estado, prioridad, FiscalId
    FROM Caso
    WHERE (@id IS NULL OR id = @id)
        AND (@fiscalId IS NULL OR FiscalId = @fiscalId)
        AND (@estado IS NULL OR estado = @estado)
        AND (@prioridad IS NULL OR prioridad = @prioridad)
    ORDER BY fechaCreacion DESC;
END
GO

-- SP para obtener Caso por Id
CREATE OR ALTER PROCEDURE SP_Caso_GetById
    @id INT
AS
BEGIN
    SELECT 
        id, titulo, descripcion, fechaCreacion, fechaActualizacion, 
        estado, prioridad, FiscalId
    FROM Caso
    WHERE id = @id;
END
GO

-- SP para Insertar Caso
CREATE OR ALTER PROCEDURE SP_Caso_Insert
    @titulo NVARCHAR(255),
    @descripcion NVARCHAR(MAX) = NULL,
    @estado NVARCHAR(255) = 'Pendiente',
    @prioridad NVARCHAR(255) = 'Media',
    @fiscalId INT,
    @fechaCreacion DATETIME,
    @fechaActualizacion DATETIME
AS
BEGIN    
    INSERT INTO Caso (titulo, descripcion, fechaCreacion, fechaActualizacion, estado, prioridad, FiscalId)
    VALUES (@titulo, @descripcion, @fechaCreacion, @fechaActualizacion, @estado, @prioridad, @fiscalId);

    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- SP para Actualizar Caso
CREATE OR ALTER PROCEDURE SP_Caso_Update
    @id INT,
    @titulo NVARCHAR(255) = NULL,
    @descripcion NVARCHAR(MAX) = NULL,
    @estado NVARCHAR(255) = NULL,
    @prioridad NVARCHAR(255) = NULL,
    @fiscalId INT = NULL,
    @fechaActualizacion DATETIME
AS
BEGIN
    UPDATE Caso
    SET titulo = ISNULL(@titulo, titulo),
        descripcion = ISNULL(@descripcion, descripcion),
        estado = ISNULL(@estado, estado),
        prioridad = ISNULL(@prioridad, prioridad),
        FiscalId = ISNULL(@fiscalId, FiscalId),
        fechaActualizacion = ISNULL(@fechaActualizacion, fechaActualizacion)
    WHERE id = @id;

    SELECT 'Actualizado correctamente' AS resultado;
END
GO

-- SP para Obtener Bitácora de Casos
CREATE OR ALTER PROCEDURE SP_BitacoraCaso_Get
    @id INT = NULL,
    @casoId INT = NULL,
    @fiscalId INT = NULL,
    @accion NVARCHAR(255) = NULL
AS
BEGIN
    SELECT 
        id, CasoId, FiscalId, accion, descripcion, fechaAccion
    FROM BitacoraCaso
    WHERE (@id IS NULL OR id = @id)
        AND (@casoId IS NULL OR CasoId = @casoId)
        AND (@fiscalId IS NULL OR FiscalId = @fiscalId)
        AND (@accion IS NULL OR accion = @accion)
    ORDER BY fechaAccion DESC;
END
GO

-- SP para obtener Bitácora por Id
CREATE OR ALTER PROCEDURE SP_BitacoraCaso_GetById
    @id INT
AS
BEGIN
    SELECT 
        id, CasoId, FiscalId, accion, descripcion, fechaAccion
    FROM BitacoraCaso
    WHERE id = @id;
END
GO

-- SP para Insertar en Bitácora
CREATE OR ALTER PROCEDURE SP_BitacoraCaso_Insert
    @casoId INT,
    @fiscalId INT,
    @accion NVARCHAR(255),
    @descripcion NVARCHAR(MAX) = NULL,
    @fechaAccion DATETIME
AS
BEGIN
    INSERT INTO BitacoraCaso (CasoId, FiscalId, accion, descripcion, fechaAccion)
    VALUES (@casoId, @fiscalId, @accion, @descripcion, @fechaAccion);
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- SP para Obtener Bitácora por Caso (historial completo de un caso)
CREATE OR ALTER PROCEDURE SP_BitacoraCaso_GetByCasoId
    @casoId INT
AS
BEGIN
    SELECT 
        bc.id,
        bc.accion,
        bc.descripcion,
        bc.fechaAccion,
        f.nombre AS fiscalNombre,
        f.rol AS fiscalRol
    FROM BitacoraCaso bc
    INNER JOIN Fiscal f ON bc.FiscalId = f.id
    WHERE bc.CasoId = @casoId
    ORDER BY bc.fechaAccion DESC;
END
GO

-- SP para Obtener Logs de Reasignación Fallida
CREATE OR ALTER PROCEDURE SP_LogReasignacion_Get
    @id INT = NULL,
    @casoId INT = NULL,
    @fiscalOrigenId INT = NULL,
    @fiscalDestinoId INT = NULL,
    @fechaInicio DATETIME = NULL,
    @fechaFin DATETIME = NULL
AS
BEGIN
    SELECT 
        id, CasoId, FiscalOrigenId, FiscalDestinoId, motivoBloqueo, fechaIntento
    FROM LogReasignacionFallida
    WHERE (@id IS NULL OR id = @id)
        AND (@casoId IS NULL OR CasoId = @casoId)
        AND (@fiscalOrigenId IS NULL OR FiscalOrigenId = @fiscalOrigenId)
        AND (@fiscalDestinoId IS NULL OR FiscalDestinoId = @fiscalDestinoId)
        AND (@fechaInicio IS NULL OR fechaIntento >= @fechaInicio)
        AND (@fechaFin IS NULL OR fechaIntento <= @fechaFin)
    ORDER BY fechaIntento DESC;
END
GO

-- SP para obtener Log de Reasignación por Id
CREATE OR ALTER PROCEDURE SP_LogReasignacion_GetById
    @id INT
AS
BEGIN
    SELECT 
        id, CasoId, FiscalOrigenId, FiscalDestinoId, motivoBloqueo, fechaIntento
    FROM LogReasignacionFallida
    WHERE id = @id;
END
GO

-- SP para Insertar Log de Reasignación Fallida
CREATE OR ALTER PROCEDURE SP_LogReasignacion_Insert
    @casoId INT,
    @fiscalOrigenId INT,
    @fiscalDestinoId INT,
    @motivoBloqueo NVARCHAR(MAX),
    @fechaIntento DATETIME
AS
BEGIN
    INSERT INTO LogReasignacionFallida (CasoId, FiscalOrigenId, FiscalDestinoId, motivoBloqueo, fechaIntento)
    VALUES (@casoId, @fiscalOrigenId, @fiscalDestinoId, @motivoBloqueo, @fechaIntento);
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- SP para Reporte de Reasignaciones Fallidas por Fiscalía
CREATE OR ALTER PROCEDURE SP_LogReasignacion_GetReporteFiscalia
    @fiscaliaId INT = NULL,
    @fechaInicio DATETIME = NULL,
    @fechaFin DATETIME = NULL
AS
BEGIN
    SELECT 
        lrf.id,
        lrf.motivoBloqueo,
        lrf.fechaIntento,
        c.titulo AS casoTitulo,
        fo.nombre AS fiscalOrigenNombre,
        fd.nombre AS fiscalDestinoNombre,
        fcia.nombre AS fiscaliaNombre
    FROM LogReasignacionFallida lrf
    INNER JOIN Caso c ON lrf.CasoId = c.id
    INNER JOIN Fiscal fo ON lrf.FiscalOrigenId = fo.id
    INNER JOIN Fiscal fd ON lrf.FiscalDestinoId = fd.id
    INNER JOIN Fiscalia fcia ON fo.FiscaliaId = fcia.id
    WHERE (@fiscaliaId IS NULL OR fcia.id = @fiscaliaId)
        AND (@fechaInicio IS NULL OR lrf.fechaIntento >= @fechaInicio)
        AND (@fechaFin IS NULL OR lrf.fechaIntento <= @fechaFin)
    ORDER BY lrf.fechaIntento DESC;
END
GO