# Project Context: Grocery Store Mock

## 1. Project Architecture & Monorepo Structure

- **Monorepo:** The codebase is divided into three primary directories: `client/`, `server/`, and `database/`.
- **Client:** Frontend UI developed using **Vite** and **React**.
- **Server:** Backend service powered by **Node.js core HTTPS**. Contains the business logic and data models.
- **Database:** A **file-based storage** system for CRUD operations. No external database engines (e.g., PostgreSQL) are used.

## 2. Directory & File Organization

- **Models:** All model logic (pure JavaScript classes) resides in the `server/` directory.
- **Storage:** The `database/` directory acts strictly as the physical storage for JSON files created by the server's CRUD operations.
- **Utilities:** There are **no shared utilities**. The `client/` and `server/` directories maintain their own independent `utils/` folders.
- **Component Pattern:** React components and their corresponding tests must be co-located (e.g., `Component.jsx` and `Component.test.js` reside in the same folder).
- **Hook Constraint:** This project does not use advanced hooks. There is **no** `client/src/hooks/` directory.

## 3. Data Modeling & Persistence

- **Schema Logic:** Models are pure JS classes that define data structures and handle mapping for file-based persistence.
- **Git Tracking:**
  - The `/database/` directory structure is tracked via Git (empty directory).
  - **Strict Rule:** Actual JSON data files within `/database/` are **not** tracked and must be ignored.

## 4. Tooling & Environment

- **Global Tools:** **Jest** is the universal testing framework for the entire project.
- **Client-Specific:** **Storybook** and **Vite** are used exclusively within the `client/` scope.

## 5. System Integration & Entry Points

- **Communication:** The Client interacts with the Server via HTTPS.
- **Backend Entry:** `/server/index.js` (The core HTTPS listener).
- **Frontend Entry:** `/client/src/main.jsx`.
- **Logic Flow:** The server imports its local models, processes requests, and performs CRUD by reading/writing files to the `/database/` directory.
