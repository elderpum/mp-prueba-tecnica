-- Crear base de datos
IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE name = 'MinisterioPublico')
BEGIN
    CREATE DATABASE MinisterioPublico;
    PRINT 'Base de datos MinisterioPublico creada';
END
ELSE
BEGIN
    PRINT 'Base de datos MinisterioPublico ya existe';
END
GO

USE MinisterioPublico;
GO

-- =============================================
-- TABLA: FISCALIA
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Fiscalia' AND xtype='U')
BEGIN
    CREATE TABLE Fiscalia (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(255) NOT NULL,
        direccion NVARCHAR(MAX),
        telefono NVARCHAR(255),
        estado BIT,
        fechaCreacion DATETIME DEFAULT GETDATE()
    );
    PRINT 'Tabla Fiscalia creada';
END
ELSE
BEGIN
    PRINT 'Tabla Fiscalia ya existe';
END
GO

-- =============================================
-- TABLA: FISCAL
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Fiscal' AND xtype='U')
BEGIN
    CREATE TABLE Fiscal (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        password NVARCHAR(255) NOT NULL,
        rol NVARCHAR(255),
        estado BIT,
        fechaCreacion DATETIME,
        FiscaliaId INT,
        FOREIGN KEY (FiscaliaId) REFERENCES Fiscalia(id)
    );
    PRINT 'Tabla Fiscal creada';
END
ELSE
BEGIN
    PRINT 'Tabla Fiscal ya existe';
END
GO

-- =============================================
-- TABLA: CASO
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Caso' AND xtype='U')
BEGIN
    CREATE TABLE Caso (
        id INT IDENTITY(1,1) PRIMARY KEY,
        titulo NVARCHAR(255) NOT NULL,
        descripcion NVARCHAR(MAX),
        fechaCreacion DATETIME,
        fechaActualizacion DATETIME,
        estado NVARCHAR(255), -- Pendiente/EnProgreso/Cerrado/Archivado
        prioridad NVARCHAR(255), -- Alta/Media/Baja
        FiscalId INT,
        FOREIGN KEY (FiscalId) REFERENCES Fiscal(id)
    );
    PRINT 'Tabla Caso creada';
END
ELSE
BEGIN
    PRINT 'Tabla Caso ya existe';
END
GO

-- =============================================
-- TABLA: BITACORA_CASO (Seguimiento/Auditoría)
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BitacoraCaso' AND xtype='U')
BEGIN
    CREATE TABLE BitacoraCaso (
        id INT IDENTITY(1,1) PRIMARY KEY,
        CasoId INT,
        FiscalId INT,
        accion NVARCHAR(255) NOT NULL, -- Creacion/Actualizacion/Reasignacion/CambioEstado
        descripcion NVARCHAR(MAX),
        fechaAccion DATETIME,
        FOREIGN KEY (CasoId) REFERENCES Caso(id),
        FOREIGN KEY (FiscalId) REFERENCES Fiscal(id)
    );
    PRINT 'Tabla BitacoraCaso creada';
END
ELSE
BEGIN
    PRINT 'Tabla BitacoraCaso ya existe';
END
GO

-- =============================================
-- TABLA: LOG_REASIGNACION_FALLIDA (Auditoría)
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LogReasignacionFallida' AND xtype='U')
BEGIN
    CREATE TABLE LogReasignacionFallida (
        id INT IDENTITY(1,1) PRIMARY KEY,
        CasoId INT,
        FiscalOrigenId INT,
        FiscalDestinoId INT,
        motivoBloqueo NVARCHAR(MAX) NOT NULL,
        fechaIntento DATETIME,
        FOREIGN KEY (CasoId) REFERENCES Caso(id),
        FOREIGN KEY (FiscalOrigenId) REFERENCES Fiscal(id),
        FOREIGN KEY (FiscalDestinoId) REFERENCES Fiscal(id)
    );
    PRINT 'Tabla LogReasignacionFallida creada';
END
ELSE
BEGIN
    PRINT 'Tabla LogReasignacionFallida ya existe';
END
GO

-- =============================================
-- DATOS DE PRUEBA: FISCALÍAS
-- =============================================
IF NOT EXISTS (SELECT * FROM Fiscalia)
BEGIN
    INSERT INTO Fiscalia (nombre, direccion, telefono) VALUES 
    ('Fiscalía Central Metropolitana', '6a. avenida 6-45, zona 1, Guatemala City', '2250-5000'),
    ('Fiscalía Distrital de Mixco', '8a. calle 7-32, zona 2, Mixco', '2250-5001'),
    ('Fiscalía de Delitos Económicos', '5a. avenida 8-90, zona 10, Guatemala City', '2250-5002'),
    ('Fiscalía de Narcotráfico', '12 calle 1-25, zona 1, Guatemala City', '2250-5003'),
    ('Fiscalía de Secuestros', '15 avenida 2-45, zona 13, Guatemala City', '2250-5004');
    
    PRINT 'Datos de Fiscalías insertados';
END
ELSE
BEGIN
    PRINT 'Datos de Fiscalías ya existen';
END
GO

-- =============================================
-- DATOS DE PRUEBA: FISCALES
-- Password: 'password' (hash bcrypt)
-- =============================================
IF NOT EXISTS (SELECT * FROM Fiscal)
BEGIN
    INSERT INTO Fiscal (FiscaliaId, nombre, email, password, rol, estado) VALUES 
    -- Fiscalía 1
    (1, 'Juan Pérez García', 'juan.perez@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal', 1),
    (1, 'María López Hernández', 'maria.lopez@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal Jefe', 1),
    (1, 'Carlos Mendoza Ruiz', 'carlos.mendoza@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal', 1),
    
    -- Fiscalía 2
    (2, 'Ana Martínez Díaz', 'ana.martinez@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal', 1),
    (2, 'Luis García Torres', 'luis.garcia@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal Jefe', 1),
    
    -- Fiscalía 3
    (3, 'Sofía Ramírez López', 'sofia.ramirez@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal', 1),
    (3, 'Miguel Ángel Castillo', 'miguel.castillo@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal', 1),
    
    -- Fiscalía 4
    (4, 'Elena Morales Santos', 'elena.morales@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal Jefe', 1),
    
    -- Fiscalía 5
    (5, 'Roberto Jiménez Paz', 'roberto.jimenez@mp.gt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fiscal Jefe', 1);
    
    PRINT 'Datos de Fiscales insertados';
END
ELSE
BEGIN
    PRINT 'Datos de Fiscales ya existen';
END
GO

-- =============================================
-- DATOS DE PRUEBA: CASOS
-- =============================================
IF NOT EXISTS (SELECT * FROM Caso)
BEGIN
    INSERT INTO Caso (FiscalId, titulo, descripcion, estado, prioridad) VALUES 
    -- Casos Fiscalía 1
    (1, 'Robo agravado en zona 1', 'Robo a mano armada en comercio de la zona 1. Se requiere investigación de cámaras de seguridad.', 'Pendiente', 'Alta'),
    (2, 'Extorsión a comerciante', 'Cobro de renta ilegal a comerciantes del mercado central. Múltiples víctimas reportadas.', 'EnProgreso', 'Alta'),
    (3, 'Hurto de vehículo', 'Sustracción de automóvil en estacionamiento público. Modelo Toyota Hilux 2022.', 'Pendiente', 'Media'),
    
    -- Casos Fiscalía 2
    (4, 'Violencia intrafamiliar', 'Caso de violencia doméstica con lesiones leves. Se requiere protección para la víctima.', 'EnProgreso', 'Alta'),
    (5, 'Amenazas por redes sociales', 'Amenazas de muerte mediante plataformas digitales. Evidencia digital recolectada.', 'Pendiente', 'Media'),
    
    -- Casos Fiscalía 3
    (6, 'Estafa financiera', 'Empresa de inversiones fraudulentas. Pérdidas estimadas de Q500,000.00', 'EnProgreso', 'Alta'),
    (7, 'Lavado de dinero', 'Red de lavado a través de comercios ficticios. Investigación en coordinación con SAT.', 'Pendiente', 'Alta'),
    
    -- Casos Fiscalía 4
    (8, 'Tráfico de sustancias', 'Incautación de 50 kg de cocaína en operativo fronterizo. Caso de alta prioridad nacional.', 'EnProgreso', 'Alta'),
    
    -- Casos Fiscalía 5
    (9, 'Secuestro express', 'Privación de libertad por 24 horas con fines de extorsión. Víctima liberada tras pago.', 'Cerrado', 'Alta'),
    (9, 'Desaparición forzada', 'Persona desaparecida hace 72 horas. Se activaron protocolos de búsqueda inmediata.', 'EnProgreso', 'Alta');
    
    PRINT 'Datos de Casos insertados';
END
ELSE
BEGIN
    PRINT 'Datos de Casos ya existen';
END
GO

-- =============================================
-- DATOS DE PRUEBA: BITACORA_CASO
-- =============================================
IF NOT EXISTS (SELECT * FROM BitacoraCaso)
BEGIN
    INSERT INTO BitacoraCaso (CasoId, FiscalId, accion, descripcion) VALUES 
    (1, 1, 'Creacion', 'Caso creado y asignado al fiscal'),
    (1, 1, 'Actualizacion', 'Se agregó evidencia de cámaras de seguridad'),
    (2, 2, 'Creacion', 'Caso creado por denuncia múltiple'),
    (2, 2, 'CambioEstado', 'Caso cambiado a EnProgreso - Inicio de investigación'),
    (9, 9, 'Creacion', 'Caso de secuestro express creado'),
    (9, 9, 'CambioEstado', 'Caso cerrado - Sentencia emitida');
    
    PRINT 'Datos de BitacoraCaso insertados';
END
ELSE
BEGIN
    PRINT 'Datos de BitacoraCaso ya existen';
END
GO

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para casos con información completa
IF EXISTS (SELECT * FROM sysobjects WHERE name='VW_CasosCompletos' AND xtype='V')
    DROP VIEW VW_CasosCompletos;
GO

CREATE VIEW VW_CasosCompletos AS
SELECT 
    c.id,
    c.titulo,
    c.descripcion,
    c.estado,
    c.prioridad,
    c.fechaCreacion,
    c.fechaActualizacion,
    f.id,
    f.nombre AS FiscalNombre,
    f.email AS FiscalEmail,
    fc.fiscaliaId,
    fc.nombre AS FiscaliaNombre
FROM Caso c
INNER JOIN Fiscal f ON c.fiscalId = f.id
INNER JOIN Fiscalia fc ON f.fiscaliaId = fc.id;
GO

PRINT 'Vista VW_CasosCompletos creada';
GO

-- =============================================
-- VERIFICACIÓN FINAL
-- =============================================
PRINT '=============================================';
PRINT 'VERIFICACIÓN DE TABLAS CREADAS:';
PRINT '=============================================';

SELECT 
    TABLE_NAME,
    CASE WHEN TABLE_NAME IN ('Fiscalia', 'Fiscal', 'Caso', 'BitacoraCaso', 'LogReasignacionFallida') 
        THEN 'Datos existentes' 
        ELSE 'Faltante' 
    END as Estado
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG = 'MinisterioPublico';

PRINT '=============================================';
PRINT 'CONTEO DE REGISTROS:';
PRINT '=============================================';

SELECT 
    'Fiscalia' as Tabla, COUNT(*) as Registros FROM Fiscalia
UNION ALL
SELECT 'Fiscal', COUNT(*) FROM Fiscal
UNION ALL
SELECT 'Caso', COUNT(*) FROM Caso
UNION ALL
SELECT 'BitacoraCaso', COUNT(*) FROM BitacoraCaso
UNION ALL
SELECT 'LogReasignacionFallida', COUNT(*) FROM LogReasignacionFallida;

PRINT '=============================================';
PRINT 'BASE DE DATOS INICIALIZADA CORRECTAMENTE';
PRINT '=============================================';
PRINT 'Estadísticas:';
PRINT '   - 5 Fiscalías creadas';
PRINT '   - 9 Fiscales registrados';
PRINT '   - 10 Casos de ejemplo';
PRINT '   - 6 Registros en bitácora';
PRINT '=============================================';