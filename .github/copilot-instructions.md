# JCPM Project — Copilot Instructions

## Big Picture Architecture
- **Monorepo** with two main apps:
  - `jcpm-api/`: Java Spring Boot backend (REST API)
  - `jcpm-frontend/`: React.js frontend (Vite)
- **Frontend** consumes backend via REST (`/api/*`), using JWT for authentication.
- **Backend** uses MySQL, HikariCP, and Spring Security (see `WebSecurityConfig.java`).
- **Frontend** is highly componentized; see `src/components/`, `src/pages/`.

## Developer Workflows
- **Frontend**:
  - Install: `npm install` in `jcpm-frontend/`
  - Dev server: `npm start` or `npm run dev` (Vite)
  - Build: `npm run build`
  - API base URL: edit `src/services/api.js`
- **Backend**:
  - Dev: `./mvnw spring-boot:run` in `jcpm-api/`
  - Prod: `java -jar jcpm-api.jar --spring.profiles.active=prod`
  - Env vars for prod: `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`
  - Main config: `application.properties`, `application-prod.properties`

## Project-Specific Patterns & Conventions
- **Auth**: Use `authService` in frontend (`src/services/api.js`) for login/register. Backend routes: `/api/auth/login`, `/api/auth/register`.
- **News Management**: News CRUD via REST endpoints; see `controller/` and `service/` in backend, and `pages/` in frontend.
- **Styling**: CSS modules per page/component; global styles in `src/styles/global.css`.
- **Responsiveness**: All pages/components are mobile-friendly.
- **Error/Success Messages**: Use `.message` CSS class for feedback.
- **CORS**: Configured to allow frontend requests (see `WebSecurityConfig.java`).

## Integration Points
- **Frontend ↔ Backend**: All API calls go through `src/services/api.js` (uses Axios).
- **Database**: MySQL, connection details in backend config files.
- **JWT**: Used for authentication; tokens stored in frontend context.

## Key Files & Directories
- `jcpm-api/src/main/java/br/com/jcpm/api/config/WebSecurityConfig.java`: Security & CORS
- `jcpm-api/src/main/resources/application.properties`: Default backend config
- `jcpm-api/src/main/resources/application-prod.properties`: Production config
- `jcpm-frontend/src/services/api.js`: API integration
- `jcpm-frontend/src/components/`, `jcpm-frontend/src/pages/`: Main UI logic
- `jcpm-frontend/src/styles/global.css`: Global styles

## Examples
- Register admin: `authService.register()` (see backend `/api/auth/register`)
- Change API URL: edit `API_BASE_URL` in `src/services/api.js`
- Run backend in dev: `./mvnw spring-boot:run`
- Run frontend in dev: `npm start` or `npm run dev`

---
For unclear or missing conventions, check `README.md` in each app or ask for clarification.
