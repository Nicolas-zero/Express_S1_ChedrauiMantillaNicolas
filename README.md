# Campuslands Express API

Conversión del proyecto Campuslands (scripts Python) a una **API REST con Express.js**.  
Cada comando/función original se expone como un **endpoint** documentado.

## Requisitos
- Node.js 18+
- npm

## Ejecutar
```bash
npm install
npm run dev   # desarrollo con nodemon
# o
npm start     # producción
```

La API levanta en: `http://localhost:3000`

---

## Endpoints

### Salud de la API
**GET** `/`  
**Funcionalidad:** Verifica que el servicio está vivo.  
**req:** sin body.  
**res:** `{ ok, name, version }`

---

## Estudiantes

### Listar estudiantes
**GET** `/api/students`  
**Funcionalidad:** Devuelve todos los estudiantes.  
**req:** sin body.  
**res:** `200` → `Student[]`

### Buscar estudiantes
**GET** `/api/students/search?name=&status=&module=`  
**Funcionalidad:** Filtra por nombre (contiene), estado o módulo.  
**req.query:** `name?: string`, `status?: 'inscrito'|'cursando'|'aprobado'|'reprobado'|'retirado'`, `module?: string`  
**res:** `200` → `Student[]`

### Obtener estudiante por id
**GET** `/api/students/:id`  
**Funcionalidad:** Trae un estudiante.  
**res:** `200` → `Student` | `404`

### Crear estudiante
**POST** `/api/students`  
**Funcionalidad:** Crea un estudiante (equivale a ModuloCrearEstudiante.py).  
**body:**  
```json
{
  "name": "John Doe",
  "email": "john@doe.com",
  "status": "inscrito",
  "module": "Python S1",
  "grades": { "project": 4.5, "work": 4.0, "quizzes": 3.8, "exam": 4.0 }
}
```  
**res:** `201` → `Student`

### Actualizar estudiante
**PUT** `/api/students/:id`  
**Funcionalidad:** Modifica todos los datos del estudiante (equivale a ModuloModificarEstudiante.py).  
**body:** mismo esquema que creación.  
**res:** `200` → `Student` | `404`

### Eliminar estudiante
**DELETE** `/api/students/:id`  
**Funcionalidad:** Elimina un estudiante (equivale a EliminarEstudiante.py).  
**res:** `200` → `{ deleted: Student }` | `404`

### Cambiar estado
**PATCH** `/api/students/:id/status`  
**Funcionalidad:** Cambia el estado del estudiante (equivale a CambiarEstado.py / actualizar_estado.py).  
**body:** `{ "status": "cursando" }`  
**res:** `200` → `Student` | `400` | `404`

### Calcular nota final
**GET** `/api/students/:id/grade`  
**Funcionalidad:** Calcula la nota final ponderada (equivale a CalcularNotaFinal.py).  
**req:** sin body.  
**res:** `200` → `{ id, name, final }`

### Cambiar nota de proyecto
**PATCH** `/api/students/:id/grades/project`  
**Funcionalidad:** Actualiza `grades.project` (equivale a CambiarNotaProyecto.py).  
**body:** `{ "project": 4.7 }`  
**res:** `200` → `Student` | `400` | `404`

### Cambiar notas de trabajo / quizzes / examen
**PATCH** `/api/students/:id/grades/work`  
**Funcionalidad:** Actualiza `grades.work`, `grades.quizzes` o `grades.exam` (equivale a CambiarNotasTrabajo.py).  
**body (cualquiera de los campos):** `{ "work": 4.0, "quizzes": 3.9, "exam": 4.2 }`  
**res:** `200` → `Student` | `400` | `404`

---

## Trainers

### Listar trainers
**GET** `/api/trainers`  
**Funcionalidad:** Lista todos los trainers (equivale a ListaTrainer.py).  
**res:** `200` → `Trainer[]`

### Agregar trainer
**POST** `/api/trainers`  
**Funcionalidad:** Crea un trainer (equivale a AgregarTrainer.py).  
**body:**  
```json
{ "name": "Ada Lovelace", "email": "ada@campus.com", "specialty": "Python" }
```  
**res:** `201` → `Trainer`

### Eliminar trainer
**DELETE** `/api/trainers/:id`  
**Funcionalidad:** Elimina un trainer (equivale a EliminarTrainer.py).  
**res:** `200` → `{ deleted: Trainer }` | `404`

---

## Módulos

### Listar módulos
**GET** `/api/modules`  
**Funcionalidad:** Lista los módulos (equivale a ListaModulo.py).  
**res:** `200` → `Module[]`

### Crear módulo
**POST** `/api/modules`  
**Funcionalidad:** Crea un módulo.  
**body:** `{ "name": "JS Avanzado", "description": "Async/Await" }`  
**res:** `201` → `Module`

---

## Salones (Classrooms)

### Listar salones
**GET** `/api/classrooms`  
**Funcionalidad:** Lista salones creados.  
**res:** `200` → `Classroom[]`

### Añadir salón
**POST** `/api/classrooms`  
**Funcionalidad:** Crea un salón (equivale a AñadirSalon.py).  
**body:** `{ "name": "A-101", "capacity": 30 }`  
**res:** `201` → `Classroom`

---

## Modelos (tipos)

```ts
type Student = {
  id: string;
  name: string;
  email: string;
  status: 'inscrito'|'cursando'|'aprobado'|'reprobado'|'retirado';
  module?: string | null;
  grades?: { project?: number; work?: number; quizzes?: number; exam?: number; }
}

type Trainer = { id: string; name: string; email: string; specialty?: string | null; }
type Module = { id: string; name: string; description?: string | null; }
type Classroom = { id: string; name: string; capacity: number; }
```

---

## Notas sobre persistencia
Se usa un archivo JSON (`data/db.json`) como almacenamiento simple (equivalente a Abrirjson.py / Guardarjson.py). Las operaciones son atómicas a nivel básico y serializan escrituras para evitar corrupción.

---

## Mapeo de scripts Python → Endpoints
- `ModuloCrearEstudiante.py` → `POST /api/students`
- `ModuloModificarEstudiante.py` → `PUT /api/students/:id`
- `EliminarEstudiante.py` → `DELETE /api/students/:id`
- `MostrarCamper.py` / `NotaCamper.py` → `GET /api/students/:id` y `GET /api/students/:id/grade`
- `filtrar_estudiante.py` → `GET /api/students/search`
- `CambiarEstado.py` / `actualizar_estado.py` → `PATCH /api/students/:id/status`
- `CalcularNotaFinal.py` → `GET /api/students/:id/grade`
- `CambiarNotaProyecto.py` → `PATCH /api/students/:id/grades/project`
- `CambiarNotasTrabajo.py` → `PATCH /api/students/:id/grades/work`
- `AgregarTrainer.py` → `POST /api/trainers`
- `EliminarTrainer.py` → `DELETE /api/trainers/:id`
- `ListaTrainer.py` → `GET /api/trainers`
- `ListaModulo.py` → `GET /api/modules`
- `AñadirSalon.py` → `POST /api/classrooms`
- `Abrirjson.py`/`Guardarjson.py` → Persistencia en `data/db.json`

---

## Estructura del proyecto
```
campuslands-express/
├─ package.json
├─ data/
│  └─ db.json
└─ src/
   ├─ app.js
   ├─ server.js
   ├─ models/
   │  └─ db.js
   ├─ utils/
   │  └─ validation.js
   ├─ controllers/
   │  ├─ students.controller.js
   │  ├─ trainers.controller.js
   │  ├─ modules.controller.js
   │  └─ classrooms.controller.js
   └─ routes/
      ├─ students.routes.js
      ├─ trainers.routes.js
      ├─ modules.routes.js
      └─ classrooms.routes.js
```
