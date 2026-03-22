# Macros Tracker App

Aplicación web construida con React, Vite y Firebase para llevar un seguimiento diario de alimentos, macronutrientes, biometría y progreso corporal.

El proyecto está pensado como un MVP funcional y visualmente cuidado: arranca desde cero para cada usuario, permite iniciar sesión con Google, registrar comidas por fecha, calcular requerimientos nutricionales a partir del perfil y visualizar evolución semanal en un historial integrado.

## Qué hace

- Registro diario de comidas por fecha.
- Búsqueda local de alimentos desde [`src/data/foods.json`](C:\Users\argen\OneDrive\Documents\personal-projects-react\macros-tracker-app\src\data\foods.json).
- Cálculo de calorías, proteína, carbohidratos, grasas, fibra, azúcar, colesterol, grasas saturadas e hidratación.
- Perfil antropométrico semanal con fecha de nacimiento, peso, cintura, estatura, sexo biológico, actividad y objetivo.
- Historial de progreso con peso, cintura, IMC e ICE.
- Autenticación con Google.
- Persistencia local y remota por usuario con Firestore.
- Modo claro y modo oscuro.

## Stack

- React 19
- Vite 8
- TypeScript
- Firebase Auth
- Cloud Firestore
- Tailwind vía configuración global embebida en `index.html`

## Estructura principal

```text
src/
  components/
    dashboard/
    log/
    profile/
    history/
    shared/
  config/
  data/
  services/
  utils/
```

## Flujo de la app

### Inicio

Muestra el resumen del día actual: calorías restantes, macros principales e indicadores de salud conectados al perfil del usuario.

### Registro

Permite:

- buscar alimentos localmente,
- elegir la comida del día,
- definir la cantidad según la unidad real del alimento,
- guardar el alimento en la fecha seleccionada.

### Perfil

Permite cargar datos corporales por semana y calcular el plan nutricional estimado. Si el usuario todavía no completó su perfil, la app no inventa valores.

### Historial

Toma los datos semanales del perfil y los cruza con el log diario para mostrar evolución corporal y cumplimiento.

## Fuente de datos de alimentos

La fuente principal del buscador es:

- [`src/data/foods.json`](C:\Users\argen\OneDrive\Documents\personal-projects-react\macros-tracker-app\src\data\foods.json)

Características de esta base:

- nombres normalizados en español,
- unidades prácticas cuando aplica,
- soporte para `g`, `ml`, `unidad` y `rebanada`,
- nutrientes calculados respecto a la unidad base declarada,
- `servingWeightGrams` para mantener equivalencias internas.

La búsqueda local vive en:

- [`src/services/foodLocal.ts`](C:\Users\argen\OneDrive\Documents\personal-projects-react\macros-tracker-app\src\services\foodLocal.ts)

## Persistencia

La app usa dos niveles de persistencia:

- `localStorage`, para respuesta rápida en el dispositivo.
- Firestore, para guardar la información por usuario autenticado.

Servicio principal:

- [`src/services/firestore.ts`](C:\Users\argen\OneDrive\Documents\personal-projects-react\macros-tracker-app\src\services\firestore.ts)

Documento usado:

- `users/{uid}/app/state`

Estado persistido:

- `loggedMealsByDate`
- `profilesByWeek`
- `theme`

## Autenticación

El login está implementado con Google usando Firebase Auth.

Servicio:

- [`src/services/auth.ts`](C:\Users\argen\OneDrive\Documents\personal-projects-react\macros-tracker-app\src\services\auth.ts)

Configuración Firebase:

- [`src/config/firebase.ts`](C:\Users\argen\OneDrive\Documents\personal-projects-react\macros-tracker-app\src\config\firebase.ts)

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con tu configuración de Firebase.

Puedes usar cualquiera de estos dos formatos porque la app soporta ambos:

```env
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
```

o bien:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Cómo correrlo

Instala dependencias:

```bash
npm install
```

Levanta el entorno de desarrollo:

```bash
npm run dev
```

Compila para producción:

```bash
npm run build
```

Previsualiza la build:

```bash
npm run preview
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Reglas de uso esperadas

- Un usuario nuevo entra sin comidas ni biometrías precargadas.
- Los cálculos de perfil aparecen cuando hay datos suficientes.
- El log puede completarse para hoy o para fechas pasadas.
- Los alimentos se guardan por fecha y por usuario.

## Consideraciones actuales

- La búsqueda de alimentos es completamente local.
- No hay integración con APIs externas.
- El proyecto está orientado a simplicidad, velocidad de uso y claridad de código.

## Próximos pasos sugeridos

- Añadir reglas de seguridad de Firestore por usuario.
- Incorporar edición directa de registros ya agregados.
- Mejorar los estados vacíos de `Inicio` e `Historial` con mensajes más guiados.
- Añadir tests para servicios y cálculos nutricionales.

## Autoría del código

Este repositorio fue evolucionando pantalla por pantalla a partir de prototipos HTML/CSS/JS integrados dentro del mismo proyecto React + Vite, manteniendo el diseño original y conectándolo progresivamente con datos reales, autenticación y persistencia.
