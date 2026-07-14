# Laboratorio Sesión 3 — Pruebas Unitarias, de Componentes y de API

**Proyecto:** task-manager-react (M1 + M2)
**Fecha:** 2026-07-10
**Rama:** feature/simulacro-incidente

> Nota sobre las capturas de pantalla: este documento incluye cada comando ejecutado junto con su salida **real**, capturada directamente al correrlos en este proyecto. Donde el checklist original pide una captura de pantalla, reproduce el comando indicado en tu propia terminal/VSCode y toma la captura en ese punto — el texto de abajo te dice exactamente qué deberías ver.

---

## Laboratorio 1 — Configurar Vitest y pruebas unitarias

### 1.1 — Instalar Vitest
Vitest ya estaba en `devDependencies` del proyecto (`vitest: ^4.1.10`). Se confirmó con:

```
npx vitest --version
```

```
vitest/4.1.10 win32-x64 node-v24.14.1
```

📸 **Captura sugerida:** salida del comando anterior en tu terminal.

### 1.2 — Configurar el entorno de pruebas
Se agregó la sección `test` dentro de [vite.config.js](../vite.config.js) (en vez de crear un `vitest.config.js` separado, ya que el proyecto usa Vite):

```js
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // ver nota más abajo
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
})
```

> Nota: en la guía, este paso empieza con `environment: 'node'` (suficiente para funciones puras) y recién en el Laboratorio 2 se cambia a `'jsdom'`. En este proyecto se hizo esa misma progresión real: primero `'node'`, se corrió el Laboratorio 1, y luego se cambió a `'jsdom'` al empezar el Laboratorio 2 (sección 2.2 de este documento).
>
> También se agregó `include` apuntando solo a `src/**` porque el backend vive en `backend/` dentro del mismo repositorio y tiene su **propia** configuración de Vitest independiente (ver Laboratorio 3). Sin este `include`, el Vitest de la raíz intentaba correr también los tests del backend.

### 1.3 — Agregar el script de pruebas
En [package.json](../package.json):

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run"
}
```

### 1.4 — Función pura elegida
El proyecto no tenía una carpeta `utils` con funciones puras, así que se creó [src/utils/tareas.ts](../src/utils/tareas.ts), inspirada en lógica que ya existe en el proyecto (el conteo de tareas completadas/pendientes en `App.tsx` y la validación de título en blanco que ya hace `TaskInput.tsx` en el navegador):

```ts
import { Task } from "../types";

export function contarTareasPendientes(tareas: Task[]): number {
    return tareas.filter((t) => !t.completed).length;
}

export function esTituloValido(titulo: string): boolean {
    return titulo.trim().length > 0;
}
```

### 1.5 — Pruebas unitarias
Archivo [src/utils/tareas.test.ts](../src/utils/tareas.test.ts), con un caso esperado y un caso límite por función (patrón Arrange-Act-Assert):

```ts
import { describe, it, expect } from 'vitest'
import { contarTareasPendientes, esTituloValido } from './tareas'

describe('contarTareasPendientes', () => {
  it('cuenta solo las tareas no completadas', () => { /* ... */ })
  it('devuelve 0 cuando la lista está vacía', () => { /* ... */ })
})

describe('esTituloValido', () => {
  it('acepta un título con texto', () => { /* ... */ })
  it('rechaza un título con solo espacios en blanco', () => { /* ... */ })
})
```

### 1.6 — Ejecutar las pruebas

```
npx vitest run
```

```
 RUN  v4.1.10 E:/UCB/Diplomado - Full Stack/Modulo1/task-manager-react

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  21:05:43
   Duration  417ms
```

📸 **Captura sugerida:** esta salida en verde con "4 passed".

### Checkpoint del Laboratorio 1
- [x] Vitest está instalado y configurado (sección `test` en `vite.config.js`).
- [x] El script `npm run test` ejecuta las pruebas correctamente.
- [x] Al menos dos pruebas unitarias en verde: un caso esperado y un caso límite (en este caso, 4 pruebas cubriendo 2 funciones).

---

## Laboratorio 2 — Prueba de componente con React Testing Library

### 2.1 — Instalar dependencias

```
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```
added 58 packages, and audited 236 packages in 17s
```

📸 **Captura sugerida:** resultado del `npm install` y el fragmento de `devDependencies` en `package.json`.

### 2.2 — Cambiar el entorno de pruebas a jsdom
`vite.config.js` pasó de `environment: 'node'` a `environment: 'jsdom'` (ver sección 1.2 arriba, ya se muestra el resultado final).

Archivo de setup [src/test/setup.ts](../src/test/setup.ts):

```ts
import '@testing-library/jest-dom'
```

### 2.3 — Componente elegido
Se usó el componente **real** del proyecto [src/componentes/TaskInput.tsx](../src/componentes/TaskInput.tsx) — ya es un formulario mínimo con un input y un botón "Agregar" que llama a `onAddTask`, exactamente la estructura que pide la guía. No fue necesario crear un componente de ejemplo ni modificarlo.

### 2.4 — Prueba del componente
Archivo [src/componentes/TaskInput.test.tsx](../src/componentes/TaskInput.test.tsx):

```tsx
describe('TaskInput', () => {
  it('llama a onAddTask con el texto escrito por el usuario', async () => {
    const onAddTask = vi.fn()
    render(<TaskInput onAddTask={onAddTask} />)
    const usuario = userEvent.setup()

    const input = screen.getByPlaceholderText('Escribe una tarea...')
    await usuario.type(input, 'Comprar pan')
    await usuario.click(screen.getByText('Agregar'))

    expect(onAddTask).toHaveBeenCalledWith('Comprar pan')
  })

  it('no llama a onAddTask si el campo está vacío', async () => {
    const onAddTask = vi.fn()
    render(<TaskInput onAddTask={onAddTask} />)
    const usuario = userEvent.setup()

    await usuario.click(screen.getByText('Agregar'))

    expect(onAddTask).not.toHaveBeenCalled()
  })
})
```

> Diferencia con el ejemplo de la guía: `TaskInput.tsx` no tiene un `<label>` asociado al input (solo `placeholder="Escribe una tarea..."`), así que se usó `screen.getByPlaceholderText(...)` en vez de `getByLabelText(...)`. Sigue siendo una búsqueda por lo que un usuario ve, no por detalles internos de implementación.

### 2.5 — Ejecutar las pruebas

```
npx vitest run
```

```
 RUN  v4.1.10 E:/UCB/Diplomado - Full Stack/Modulo1/task-manager-react

 Test Files  2 passed (2)
      Tests  6 passed (6)
   Start at  21:07:34
   Duration  4.68s
```

📸 **Captura sugerida:** esta salida en verde con "2 Test Files" y "6 Tests".

### Checkpoint del Laboratorio 2
- [x] Se instaló React Testing Library y se configuró el entorno `jsdom`.
- [x] La prueba simula una interacción real (escribir y hacer clic), no revisa estado interno.
- [x] La prueba pasa en verde y no depende del diseño visual del componente.

---

## Laboratorio 3 — Cacería de Bugs (BUG 3: API)

**Ticket:** el endpoint `POST /tasks` acepta y guardaría una tarea con título vacío **o solo espacios en blanco**.

Este es un bug **real** encontrado en el proyecto (no un ejemplo inventado): `TaskInput.tsx` ya valida `titulo.trim()` en el frontend antes de llamar a `onAddTask`, pero el backend (`backend/src/index.ts`) solo validaba `if (!text)`, lo cual es `false` para un string de solo espacios (`"   "` es "truthy" en JavaScript). Es decir, cualquier cliente que llame directo a la API (sin pasar por el formulario) podía crear tareas con título en blanco.

### Preparación — instalar Supertest y separar la app de Express del arranque del servidor
Para poder testear con Supertest sin abrir un puerto real ni depender de que el servidor esté corriendo, se separó `backend/src/index.ts` en dos archivos:

- [backend/src/app.ts](../backend/src/app.ts) — crea y configura la instancia de Express (`app`), define todas las rutas, y la exporta con `export default app`. **No llama a `app.listen()`.**
- [backend/src/index.ts](../backend/src/index.ts) — importa `app` y recién ahí llama a `app.listen(PORT, ...)`.

```
npm install -D vitest supertest @types/supertest
```

```
added 66 packages, changed 1 package, and audited 341 packages in 34s
```

Se agregó `backend/vitest.config.ts` (entorno `node`, no necesita `jsdom` porque es una API, no un componente) y el script `"test": "vitest run"` en `backend/package.json`.

📸 **Captura sugerida:** el `npm install` de Supertest y la estructura final `backend/src/app.ts` + `backend/src/index.ts`.

### Ronda 1 — Reproducir el bug (prueba en rojo)
Archivo [backend/tests/tareas.test.ts](../backend/tests/tareas.test.ts):

```ts
import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app'

describe('POST /tasks - validación de título', () => {
  it('rechaza crear una tarea con título vacío', async () => {
    const res = await request(app).post('/tasks').send({ text: '' })
    expect(res.status).toBe(400)
  })

  it('rechaza crear una tarea con título de solo espacios en blanco', async () => {
    const res = await request(app).post('/tasks').send({ text: '   ' })
    expect(res.status).toBe(400)
  })
})
```

Al correr `npx vitest run` **antes** de corregir el backend:

```
 ❯ tests/tareas.test.ts (2 tests | 1 failed) 773ms
     × rechaza crear una tarea con título de solo espacios en blanco 715ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/tareas.test.ts > POST /tasks - validación de título > rechaza crear una tarea con título de solo espacios en blanco
AssertionError: expected 500 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 500

 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
```

El bug quedó reproducido: la API no devuelve 400 para un título de solo espacios (en este entorno devuelve 500 porque, al no rechazar el texto, el código intenta seguir hasta la base de datos).

📸 **Captura sugerida (obligatoria para la insignia "Cazador de Bugs"):** esta salida en rojo mostrando el `AssertionError: expected 500 to be 400`.

### Ronda 2 — Corregir el código
En `backend/src/app.ts`, dentro de la ruta `POST /tasks`:

```diff
- if (!text) {
+ if (!text || !text.trim()) {
      res.status(400).json({ message: "El campo text es requerido" });
      return;
  }
```

Al correr `npx vitest run` **después** de corregir el backend:

```
 RUN  v4.1.10 E:/UCB/Diplomado - Full Stack/Modulo1/task-manager-react/backend

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  21:11:07
   Duration  1.08s
```

📸 **Captura sugerida (obligatoria para la insignia "Cazador de Bugs"):** esta salida en verde, justo después de la de arriba, para mostrar el ciclo rojo → verde.

Se verificó además que la refactorización no rompió el build de TypeScript del backend:

```
npx tsc --noEmit
```

```
(sin salida — sin errores de tipos)
```

### Ronda 3 — Verificación final
Suite completa de frontend (unitarias + componente) y backend (API), cada una con un solo comando:

```
npx vitest run          # desde la raíz del proyecto (frontend)
```
```
 Test Files  2 passed (2)
      Tests  6 passed (6)
```

```
cd backend && npx vitest run   # backend
```
```
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

📸 **Captura sugerida (obligatoria para la insignia "Triple Verde"):** ambas salidas en verde, mostrando en total 8 pruebas pasando (4 unitarias + 2 de componente + 2 de API).

### Checklist del Laboratorio 3
- [x] Prueba nueva que describe el comportamiento correcto (Ronda 1).
- [x] Prueba confirmada en rojo antes de tocar el código fuente.
- [x] Corrección aplicada en el archivo fuente (`backend/src/app.ts`), no en el test.
- [x] Prueba confirmada en verde después de la corrección.
- [x] Suite completa (frontend + backend) en verde.

---

## Entregable final de la Sesión 3

- [x] Vitest configurado, con `npm run test` funcionando (frontend y backend).
- [x] 4 pruebas unitarias en verde sobre funciones puras (`contarTareasPendientes`, `esTituloValido`), caso esperado + caso límite.
- [x] 2 pruebas de componente con React Testing Library en verde (`TaskInput.tsx`), simulando interacción real (escribir + clic).
- [x] 2 pruebas de API con Supertest en verde (`POST /tasks`).
- [x] Ciclo completo documentado: prueba en rojo (`500` en vez de `400`) → código corregido (`!text.trim()`) → prueba en verde.
- [x] Suite completa corre en verde con un solo comando por proyecto (`npx vitest run` en la raíz y en `backend/`).

## Archivos nuevos o modificados

| Archivo | Cambio |
|---|---|
| `vite.config.js` | Config de Vitest (jsdom, setup, include) |
| `package.json` | Script `test` |
| `src/utils/tareas.ts` | Función pura nueva |
| `src/utils/tareas.test.ts` | Pruebas unitarias (Lab 1) |
| `src/test/setup.ts` | Setup de jest-dom (Lab 2) |
| `src/componentes/TaskInput.test.tsx` | Prueba de componente (Lab 2) |
| `backend/src/app.ts` | App de Express extraída de `index.ts`, sin `listen()`; incluye la corrección del bug |
| `backend/src/index.ts` | Ahora solo importa `app` y llama a `app.listen()` |
| `backend/vitest.config.ts` | Config de Vitest del backend |
| `backend/package.json` | Script `test`, devDependencies `vitest`/`supertest` |
| `backend/tests/tareas.test.ts` | Pruebas de API (Lab 3) |
