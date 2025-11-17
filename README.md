# Prueba Técnica - Ministerio Público
##  Gestión de Casos, Fiscales y Fiscalías

```js
Programador: Elder Anibal Pum Rojas
Correo: ElderPum@gmail.com
```
---

# Explicación del Proyecto
Es un proyecto que consta de 2 partes: un backend y un frontend, completamente dockerizado para facilitar el despliegue y desarrollo.

El backend está desarrollado con TypeScript y corre Node 20. Es una API REST que se conecta a una base de datos SQL Server y utiliza stored procedures para la manipulación de datos. La API funciona como intermediario entre el frontend y la base de datos, proporcionando endpoints RESTful para la gestión de casos, fiscales, fiscalías y sus respectivas bitácoras.

El frontend está desarrollado con React, TypeScript y Vite, utilizando Bootstrap y Font Awesome para los estilos, así como un sistema de diseño CSS personalizado con variables CSS para mantener consistencia en toda la aplicación.

El proyecto utiliza Docker Compose para orquestar los servicios (base de datos SQL Server, backend y frontend), permitiendo un despliegue rápido y consistente en cualquier entorno.

## Arquitectura del Proyecto
![](https://i.ibb.co/XxKjMT6c/image.png)

La arquitectura del proyecto sigue un patrón de tres capas (3-tier architecture) con separación clara de responsabilidades:

### Capa de Presentación (Frontend)
- **Tecnología**: React 19 con TypeScript y Vite
- **Responsabilidades**: 
  - Interfaz de usuario interactiva
  - Gestión de estado del cliente
  - Enrutamiento y navegación protegida
  - Visualización de datos y gráficas
- **Comunicación**: Se comunica exclusivamente con el backend mediante peticiones HTTP/REST
- **Autenticación**: Maneja tokens JWT almacenados en localStorage para mantener sesiones

### Capa de Aplicación (Backend/API)
- **Tecnología**: Node.js 20 con Express y TypeScript
- **Responsabilidades**:
  - Procesamiento de lógica de negocio
  - Validación de datos de entrada
  - Autenticación y autorización mediante JWT
  - Creación automática de bitácoras y logs
  - Transformación de datos entre frontend y base de datos
- **Arquitectura MVC**:
  - **Rutas (Routes)**: Definen los endpoints y middlewares de autenticación
  - **Controladores (Controllers)**: Contienen la lógica de negocio y manejan requests/responses
  - **Modelos (Models)**: Interactúan con la base de datos mediante stored procedures
- **Comunicación**: 
  - Recibe peticiones del frontend
  - Ejecuta stored procedures en SQL Server
  - Devuelve respuestas JSON estructuradas

### Capa de Datos (Base de Datos)
- **Tecnología**: Microsoft SQL Server 2019
- **Responsabilidades**:
  - Almacenamiento persistente de datos
  - Ejecución de stored procedures para operaciones CRUD
  - Integridad referencial mediante foreign keys
  - Auditoría mediante tablas de bitácora
- **Stored Procedures**: 
  - Toda la lógica de acceso a datos está encapsulada en stored procedures
  - Operaciones CRUD optimizadas y seguras
  - Validaciones a nivel de base de datos

### Flujo de Datos
1. **Autenticación**: El usuario inicia sesión desde el frontend, el backend valida credenciales contra la BD y devuelve un token JWT
2. **Peticiones Autenticadas**: Cada petición del frontend incluye el token JWT en el header Authorization
3. **Middleware de Autenticación**: El backend valida el token antes de procesar cualquier petición
4. **Procesamiento**: El controlador ejecuta la lógica de negocio y llama al modelo correspondiente
5. **Acceso a Datos**: El modelo ejecuta stored procedures en SQL Server
6. **Respuesta**: Los datos se transforman y se devuelven al frontend en formato JSON

### Orquestación con Docker
- **Docker Compose**: Orquesta tres servicios independientes:
  - **mp-database**: Contenedor de SQL Server con persistencia de datos
  - **mp-backend**: Contenedor del API REST con Node.js
  - **mp-frontend**: Contenedor con Nginx sirviendo la aplicación React compilada
- **Comunicación**: Los servicios se comunican mediante la red interna de Docker
- **Persistencia**: Los datos de la base de datos se almacenan en volúmenes Docker para persistencia

# Modelo Entidad-Relación
![](https://i.ibb.co/DfbYFXM9/image.png)

El modelo de base de datos está diseñado para gestionar el flujo de trabajo del Ministerio Público, manteniendo relaciones claras entre las entidades principales y tablas de auditoría para trazabilidad completa.

## Entidades Principales

### Fiscalia
Representa las diferentes oficinas o departamentos del Ministerio Público.

**Atributos**:
- `id` (INT, PK): Identificador único autoincremental
- `nombre` (NVARCHAR(255), NOT NULL): Nombre de la fiscalía
- `direccion` (NVARCHAR(MAX)): Dirección física de la fiscalía
- `telefono` (NVARCHAR(255)): Número de teléfono de contacto
- `estado` (BIT): Estado activo/inactivo (1 = activo, 0 = inactivo)
- `fechaCreacion` (DATETIME): Fecha de creación del registro

**Relaciones**:
- Una Fiscalía tiene muchos Fiscales (relación 1:N)

### Fiscal
Representa a los usuarios del sistema que gestionan los casos. Cada fiscal pertenece a una fiscalía específica.

**Atributos**:
- `id` (INT, PK): Identificador único autoincremental
- `nombre` (NVARCHAR(255), NOT NULL): Nombre completo del fiscal
- `email` (NVARCHAR(255), NOT NULL): Correo electrónico único para autenticación
- `password` (NVARCHAR(255), NOT NULL): Contraseña hasheada con bcrypt
- `rol` (NVARCHAR(255)): Rol del fiscal (ej: "Fiscal", "Fiscal Jefe")
- `estado` (BIT): Estado activo/inactivo (1 = activo, 0 = inactivo)
- `fechaCreacion` (DATETIME): Fecha de registro del fiscal
- `FiscaliaId` (INT, FK): Referencia a la Fiscalía a la que pertenece

**Relaciones**:
- Pertenece a una Fiscalía (N:1 con Fiscalia)
- Puede tener muchos Casos asignados (1:N con Caso)
- Puede realizar múltiples acciones en Bitácoras (1:N con BitacoraCaso)
- Puede ser Fiscal Origen o Destino en Logs de Reasignación (1:N con LogReasignacionFallida)

### Caso
Representa los expedientes o asuntos que gestiona el Ministerio Público. Cada caso está asignado a un fiscal y tiene un estado y prioridad.

**Atributos**:
- `id` (INT, PK): Identificador único autoincremental
- `titulo` (NVARCHAR(255), NOT NULL): Título descriptivo del caso
- `descripcion` (NVARCHAR(MAX)): Descripción detallada del caso
- `fechaCreacion` (DATETIME): Fecha de creación del caso
- `fechaActualizacion` (DATETIME): Última fecha de modificación
- `estado` (NVARCHAR(255)): Estado del caso (Pendiente, EnProgreso, Cerrado, Archivado)
- `prioridad` (NVARCHAR(255)): Prioridad del caso (Alta, Media, Baja)
- `FiscalId` (INT, FK): Referencia al Fiscal asignado al caso

**Relaciones**:
- Pertenece a un Fiscal (N:1 con Fiscal)
- Puede tener múltiples registros en Bitácora (1:N con BitacoraCaso)
- Puede tener múltiples intentos de reasignación fallidos (1:N con LogReasignacionFallida)

## Tablas de Auditoría

### BitacoraCaso
Registra todas las acciones realizadas sobre los casos para mantener un historial completo de auditoría.

**Atributos**:
- `id` (INT, PK): Identificador único autoincremental
- `CasoId` (INT, FK): Referencia al Caso sobre el que se realizó la acción
- `FiscalId` (INT, FK): Referencia al Fiscal que realizó la acción
- `accion` (NVARCHAR(255), NOT NULL): Tipo de acción (Creacion, Actualizacion, Reasignacion, CambioEstado)
- `descripcion` (NVARCHAR(MAX)): Descripción detallada de la acción realizada
- `fechaAccion` (DATETIME): Fecha y hora en que se realizó la acción

**Relaciones**:
- Pertenece a un Caso (N:1 con Caso)
- Pertenece a un Fiscal (N:1 con Fiscal)

**Propósito**: Mantener seguimiento completo de todas las modificaciones y cambios de estado en los casos.

### LogReasignacionFallida
Registra los intentos fallidos de reasignación de casos cuando no se cumplen las condiciones necesarias.

**Atributos**:
- `id` (INT, PK): Identificador único autoincremental
- `CasoId` (INT, FK): Referencia al Caso que se intentó reasignar
- `FiscalOrigenId` (INT, FK): Referencia al Fiscal original asignado al caso
- `FiscalDestinoId` (INT, FK): Referencia al Fiscal al que se intentó reasignar
- `motivoBloqueo` (NVARCHAR(MAX), NOT NULL): Descripción del motivo por el cual falló la reasignación
- `fechaIntento` (DATETIME): Fecha y hora del intento de reasignación

**Relaciones**:
- Pertenece a un Caso (N:1 con Caso)
- Tiene un Fiscal Origen (N:1 con Fiscal)
- Tiene un Fiscal Destino (N:1 con Fiscal)

**Propósito**: Auditoría de intentos fallidos de reasignación para análisis y mejora de procesos.

## Reglas de Negocio Implementadas

1. **Integridad Referencial**: Todas las foreign keys garantizan que no se puedan eliminar registros padre si existen registros hijos relacionados.

2. **Eliminación Lógica**: Las tablas `Fiscalia` y `Fiscal` utilizan el campo `estado` para eliminación lógica en lugar de eliminación física, preservando el historial.

3. **Estados de Caso**: Los casos pueden tener cuatro estados posibles:
   - **Pendiente**: Caso recién creado, esperando asignación o inicio de trabajo
   - **EnProgreso**: Caso en proceso de investigación o gestión activa
   - **Cerrado**: Caso finalizado con resolución
   - **Archivado**: Caso cerrado y archivado para consulta histórica

4. **Prioridades de Caso**: Los casos pueden tener tres niveles de prioridad:
   - **Alta**: Requiere atención inmediata
   - **Media**: Prioridad estándar
   - **Baja**: Puede ser atendido con menor urgencia

5. **Reasignación de Casos**: Un caso solo puede ser reasignado si:
   - El estado actual es "Pendiente"
   - El fiscal destino pertenece a la misma fiscalía que el fiscal origen
   - Si no se cumplen estas condiciones, se registra un log de reasignación fallida

## Comandos para levantar el proyecto con Docker

Para levantar el proyecto completo con Docker Compose, ejecuta los siguientes comandos en orden:

1. **Levantar los servicios** (base de datos, backend y frontend):
```sh
docker-compose up -d database backend frontend
```

2. **Crear la base de datos y las tablas**:
```sh
docker exec mp-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MpPassword123!" -C -i /scripts/db.sql
```

3. **Crear los stored procedures**:
```sh
docker exec mp-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MpPassword123!" -C -d MinisterioPublico -i /scripts/sp.sql
```

4. **Verificar que los stored procedures se crearon correctamente** (opcional):
```sh
docker exec mp-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MpPassword123!" -C -d MinisterioPublico -Q "SELECT name FROM sys.procedures ORDER BY name"
```

Una vez ejecutados estos comandos, el proyecto estará completamente funcional:
- **Base de datos**: Disponible en el puerto configurado en `docker-compose.yml`
- **Backend API**: Disponible en `http://localhost:5000`
- **Frontend**: Disponible en `http://localhost:3000` (o el puerto configurado en `FRONTEND_PORT`)

# Procedimientos utilizados en la parte de la API
Se requiere la versión de [Node.Js](https://nodejs.org/en/) más reciente para evitar cualquier tipo de problemas a la hora de correr la API Rest.

Después de instalar o actualizar la versión de NodeJS en su SO, se necesita instalar las librerías necesarias para que funcione, para ello vamos a localizar el siguiente archivo dentro de la carpeta correspondiente al servidor de Node:
```sh
package.json
```
Una vez ubicado, vamos a abrir una terminal y vamos a instalar dicho archivo con el comando:
```sh
npm install
```
Después de haber instalado las librerías y dependencias necesarias, lo que sigue es correr la API Rest con el siguiente comando:
```sh
npm run dev
```

De esta forma el servidor se pondrá a escuchar en el puerto 5000 por defecto, haciendo posible poder escuchar cualquier petición que el frontend mande.
El servidor tiene una filosofía de trabajo MVC (Modelo-Vista-Controlador) donde las rutas referencian al controlador y estas son las que se comunican con el frontend, el modelo que nos ayuda a conectar con la base de datos SQL Server mediante stored procedures, y el controlador contiene toda la parte de la lógica que hace funcionar el proyecto. El proyecto se divide en múltiples módulos, los principales son: auth (autenticación), fiscales, fiscalías, casos, bitácoras y logs de reasignación.

### Módulo de Autenticación (Auth)
El módulo de autenticación permite a los fiscales iniciar sesión en el sistema utilizando sus credenciales almacenadas en la base de datos. Las contraseñas se almacenan hasheadas con bcrypt para mayor seguridad.

| Método             | Tipo de Petición | Endpoint | Descripción | 
| --                    | -- | -- | -- |
| Login   | POST  | `/api/auth/login` | Autentica un fiscal con email y contraseña, devuelve un token JWT de acceso |
| Verificar Token   | GET  | `/api/auth/verify` | Verifica la validez del token JWT del usuario autenticado |

### Módulo de Fiscales
Los fiscales representan a los usuarios del sistema que gestionan los casos. Cada fiscal pertenece a una fiscalía y tiene un rol asignado.

| Método             | Tipo de Petición | Endpoint | Descripción | 
| --                    | -- | -- | -- |
| Obtener Fiscales | GET | `/api/fiscales` | Obtiene en formato JSON todos los fiscales registrados. Puede filtrar por `fiscaliaId` y `estado` mediante query parameters |
| Obtener Fiscal por ID | GET | `/api/fiscales/:id` | Obtiene un fiscal específico dependiendo de su ID |
| Crear Fiscal | POST | `/api/fiscales` | Crea un nuevo fiscal. La contraseña se hashea automáticamente antes de guardarse |
| Actualizar Fiscal | PUT | `/api/fiscales/:id` | Actualiza un fiscal existente. Si se proporciona una nueva contraseña, se hashea automáticamente |
| Eliminar Fiscal | DELETE | `/api/fiscales/:id` | Elimina un fiscal de forma lógica (actualiza el estado a 0) |

### Módulo de Fiscalías
Las fiscalías representan las diferentes oficinas o departamentos del Ministerio Público donde trabajan los fiscales.

| Método             | Tipo de Petición | Endpoint | Descripción | 
| --                    | -- | -- | -- |
| Obtener Fiscalías | GET | `/api/fiscalias` | Obtiene en formato JSON todas las fiscalías registradas. Puede filtrar por `nombre` y `estado` mediante query parameters |
| Obtener Fiscalía por ID | GET | `/api/fiscalias/:id` | Obtiene una fiscalía específica dependiendo de su ID |
| Crear Fiscalía | POST | `/api/fiscalias` | Crea una nueva fiscalía |
| Actualizar Fiscalía | PUT | `/api/fiscalias/:id` | Actualiza una fiscalía existente |
| Eliminar Fiscalía | DELETE | `/api/fiscalias/:id` | Elimina una fiscalía de forma lógica (actualiza el estado a 0) |

### Módulo de Casos
Los casos representan los expedientes o asuntos que gestiona el Ministerio Público. Cada caso tiene un estado (Pendiente, EnProgreso, Cerrado, Archivado) y una prioridad (Alta, Media, Baja), y está asignado a un fiscal.

| Método             | Tipo de Petición | Endpoint | Descripción | 
| --                    | -- | -- | -- |
| Obtener Casos | GET | `/api/casos` | Obtiene en formato JSON todos los casos registrados. Puede filtrar por `fiscalId`, `estado` y `prioridad` mediante query parameters |
| Obtener Caso por ID | GET | `/api/casos/:id` | Obtiene un caso específico dependiendo de su ID |
| Crear Caso | POST | `/api/casos` | Crea un nuevo caso. Automáticamente crea una bitácora con acción "Creacion" |
| Actualizar Caso | PUT | `/api/casos/:id` | Actualiza un caso existente. Si cambia el estado, crea una bitácora con acción "CambioEstado", de lo contrario crea una con acción "Actualizacion" |
| Eliminar Caso | DELETE | `/api/casos/:id` | Elimina un caso |

### Módulo de Bitácora de Casos
La bitácora registra todas las acciones realizadas sobre los casos (creación, actualización, cambio de estado, reasignación) para mantener un historial de auditoría.

| Método             | Tipo de Petición | Endpoint | Descripción | 
| --                    | -- | -- | -- |
| Obtener Bitácoras | GET | `/api/bitacoras` | Obtiene en formato JSON todas las bitácoras registradas. Puede filtrar por `casoId` y `fiscalId` mediante query parameters |
| Obtener Bitácora por ID | GET | `/api/bitacoras/:id` | Obtiene una bitácora específica dependiendo de su ID |
| Crear Bitácora | POST | `/api/bitacoras` | Crea un nuevo registro en la bitácora |
| Actualizar Bitácora | PUT | `/api/bitacoras/:id` | Actualiza un registro de bitácora existente |
| Eliminar Bitácora | DELETE | `/api/bitacoras/:id` | Elimina un registro de bitácora |

### Módulo de Logs de Reasignación Fallida
Los logs registran los intentos fallidos de reasignación de casos cuando no se cumplen las condiciones necesarias (caso debe estar en estado Pendiente y el nuevo fiscal debe pertenecer a la misma fiscalía).

| Método             | Tipo de Petición | Endpoint | Descripción | 
| --                    | -- | -- | -- |
| Obtener Logs | GET | `/api/logs-reasignacion` | Obtiene en formato JSON todos los logs de reasignación fallida registrados |
| Obtener Log por ID | GET | `/api/logs-reasignacion/:id` | Obtiene un log específico dependiendo de su ID |
| Obtener Reporte por Fiscalía | GET | `/api/logs-reasignacion/reporte/fiscalia` | Obtiene un reporte detallado de reasignaciones fallidas agrupadas por fiscalía |
| Crear Log | POST | `/api/logs-reasignacion` | Crea un nuevo log de reasignación fallida |

# Procedimientos utilizados en la parte del Frontend
El frontend está desarrollado con React 19, TypeScript y Vite como bundler. Se utilizan las siguientes tecnologías y librerías:

- **React Router DOM**: Para la navegación entre páginas y rutas protegidas
- **Bootstrap 5**: Para el sistema de diseño y componentes UI
- **Font Awesome 6**: Para los iconos
- **Chart.js y react-chartjs-2**: Para la visualización de gráficas en los reportes
- **CSS Variables**: Sistema de diseño personalizado con variables CSS para mantener consistencia

## Estructura del Frontend

El proyecto sigue una arquitectura basada en componentes reutilizables:

- **Componentes**: Componentes React para las diferentes vistas (Login, Listados, Formularios, Reportes)
- **Hooks personalizados**: `useAuth`, `useLogin`, `useDataTable`, `useNavigation` para manejar lógica reutilizable
- **Servicios**: Capa de servicios para comunicarse con la API (`api.ts`, `fiscalesService.ts`, `casosService.ts`, etc.)
- **Tipos**: Definiciones TypeScript para tipado fuerte

## Funcionalidades del Frontend

- **Autenticación**: Login con validación y manejo de tokens JWT
- **Gestión de Fiscales**: CRUD completo con formularios para crear, editar y ver detalles
- **Gestión de Fiscalías**: CRUD completo con formularios para crear, editar y ver detalles
- **Gestión de Casos**: CRUD completo con formularios avanzados que incluyen botones especiales para cambio de estado
- **Bitácoras**: Visualización de historial de acciones sobre casos
- **Logs de Reasignación**: Visualización de intentos fallidos de reasignación
- **Reportes**: Gráficas de barras mostrando estadísticas de casos por estado

Todas las rutas están protegidas con autenticación y requieren un token JWT válido para acceder.

## Capturas de Pantalla del Frontend

### Página de Login
![Login](https://i.ibb.co/PsTKSLTg/image.png)
*Pantalla de inicio de sesión con validación de credenciales y diseño moderno usando Bootstrap y Font Awesome.*

### Dashboard / Home
![Dashboard](https://i.ibb.co/F4mw1yD5/image.png)
*Vista principal después del login, mostrando información del usuario y acceso rápido a los módulos principales.*

### Listado de Fiscales
![Listado Fiscales](https://i.ibb.co/849GfY6V/image.png)
*Tabla de fiscales con funcionalidades de búsqueda, paginación y acciones CRUD. Muestra estado activo/inactivo con badges.*

### Formulario de Fiscal (Detalle/Edición/Creación)
![Formulario Fiscal Detalle](https://i.ibb.co/mCD6rj8y/image.png)
![Formulario Fiscal Edicion](https://i.ibb.co/B2K061Ts/image.png)
![Formulario Fiscal Creacion](https://i.ibb.co/Gf4VPmX2/image.png)
*Formulario para crear o editar fiscales con validación de campos, selección de fiscalía y gestión de estado.*

### Listado de Fiscalías
![Listado Fiscalías](https://i.ibb.co/CKjFNCr1/image.png)
*Tabla de fiscalías con información completa incluyendo dirección y teléfono. Incluye búsqueda y filtrado.*

### Formulario de Fiscalía (Detalle/Edición/Creación)
![Formulario Fiscalía Detalle](https://i.ibb.co/d0hKs1k3/image.png)
![Formulario Fiscalía Edicion](https://i.ibb.co/7JSrgsy9/image.png)
![Formulario Fiscalía Creacion](https://i.ibb.co/Z1fKL7x1/image.png)
*Formulario para gestionar fiscalías con campos de nombre, dirección, teléfono y estado.*

### Listado de Casos
![Listado Casos](https://i.ibb.co/N2Wrk5y8/image.png)
*Tabla de casos con badges de colores para estados y prioridades. Muestra información del fiscal asignado y fechas importantes.*

### Formulario de Caso (Detalle/Edición/Creación)
![Formulario Caso Detalle](https://i.ibb.co/Dg9vwfzD/image.png)
![Formulario Caso Edicion](https://i.ibb.co/t5dqrRC/image.png)
![Formulario Caso Creacion](https://i.ibb.co/gb3ncHmm/image.png)
*Formulario completo para gestionar casos con selección de fiscal, estado, prioridad y botones especiales para cambio de estado según el estado actual del caso.*

### Bitácora de Casos
![Bitácora](https://i.ibb.co/b55YYhZf/image.png)
*Listado de todas las acciones realizadas sobre los casos con badges de colores según el tipo de acción (Creación, Actualización, CambioEstado).*

### Logs de Reasignación Fallida
![Logs Reasignación](https://i.ibb.co/KcqWb7nQ/image.png)
*Visualización de intentos fallidos de reasignación de casos con información detallada del motivo del bloqueo.*

### Reportes
![Reportes](https://i.ibb.co/wFb3Gw9N/image.png)
*Dashboard de reportes con gráfica de barras mostrando estadísticas de casos por estado y tarjetas de resumen con conteos.*