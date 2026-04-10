# 📘 SERVER CODING RULES (AI AGENT)

---

## 🔴 CORE PRINCIPLES

- Code MUST be modular, separated, and organized by responsibility
- Code MUST NEVER mix responsibilities across layers
- Any reusable logic MUST be extracted into its own module (file)
- Prefer small, focused, independent modules

---

## 📁 PROJECT STRUCTURE RULES

### RULE: DIRECTORY_USAGE

- controllers/ → request/response handling only
- services/ → business logic only
- models/ → data structures (classes) only
- utils/ → reusable pure helper functions only
- routes/ → endpoint definitions only
- middleware/ → request pipeline logic
- types/ → TypeScript types/interfaces

---

### RULE: NO_LAYER_VIOLATION

- Controllers MUST NOT contain business logic
- Controllers MUST NOT access file system or models directly

- Services MUST NOT handle HTTP (req, res)

- Utils MUST NOT:
  - Contain business logic
  - Depend on controllers or services

- Models MUST NOT:
  - Contain business logic
  - Perform file operations

---

## 📛 NAMING CONVENTIONS

### RULE: FILE_NAMING

- Filenames MUST follow:

- Service → `<task>Service.ts`
- Controller → `<entity>Controller.ts`
- Route → `<entity>Routes.ts`
- Model → `<Entity>.ts`
- Util → `<functionName>.ts`
- Middleware → `<name>Middleware.ts`
- Test → `<name>.test.ts`

---

### RULE: FUNCTION_NAMING

- Functions MUST use camelCase
- Names MUST clearly describe behavior

---

## 🧠 CONTROLLER RULES

### RULE: CONTROLLER_RESPONSIBILITY

Controllers MUST:

- Extract request data
- Call service functions
- Return response

Controllers MUST NOT:

- Contain business logic
- Perform file operations
- Perform heavy computation

---

## ⚙️ SERVICE RULES

### RULE: SERVICE_RESPONSIBILITY

Services MUST:

- Contain business logic
- Orchestrate utils and models
- Be reusable and independent

Services MUST NOT:

- Use req or res
- Contain unrelated reusable utilities

## databse is file persistance

## location is `./database`

### RULE: SERVICE_MODULARITY

- Each service file MUST focus on ONE responsibility
- Large logic MUST be split into smaller functions
- Reusable logic must be made stand-alone module

---

## 🧩 MODULE & REUSABILITY RULES

### RULE: MODULE_EXTRACTION

If logic is:

- highly reusable
- independent
- used in multiple places

→ MUST be moved into its own file and exported module

---

### RULE: MODULE_SCOPE

- One module = one responsibility
- MUST NOT mix unrelated logic

---

### RULE: SERVICE_AS_MODULE

If a service:

- is reusable across multiple services
- is independent

→ MUST exist as its own module

---

### RULE: EXPORT_CONVENTION

- Used outside services/ → MUST use default export, if possible, otherwise named export is fine
- Used only within services/ → MUST use named export

---

### RULE: MODULE_NAMING

- File name MUST describe exact functionality

❌ Forbidden:

- helpers.ts
- utils.ts
- common.ts
- misc.ts

---

## 🧩 UTILS RULES

### RULE: UTIL_PURITY

- MUST be pure functions
- No side effects
- No business logic

---

### RULE: UTIL_SPLIT

- One util file = one responsibility

---

### RULE: UTIL_EXTRACTION

- Shared logic MUST be moved to utils immediately
- if logic is not shared but have one use only, placed at thw top of the file it uses it, with a label like comments

---

## 🧱 MODEL RULES

### RULE: MODEL_STRUCTURE

- MUST be classes
- Represent schema/data only

### RULE: database

database is file persistance in ./database

### RULE: MODEL_LIMITATION

Models MUST NOT:

- Contain business logic
- Handle persistence
- Call services or utils

---

## 💾 FILE PERSISTENCE RULES

### RULE: FILE_ACCESS

- File operations MUST be isolated
- Use dedicated module (e.g., fileStore.ts)

---

### RULE: FILE_ABSTRACTION

- Services MUST use abstraction
- MUST NOT manipulate raw file structure

---

## 🔀 ROUTES RULES

### RULE: ROUTE_STRUCTURE

Routes MUST:

- Define endpoints
- Attach controllers

Routes MUST NOT:

- Contain logic
- Call services directly

---

## 🧪 TEST RULES

### RULE: TEST_COLOCATION

- Each module MUST have a `.test.ts` file

---

### RULE: TEST_SCOPE

- Utils → unit tests
- Services → unit tests
- Models → structure tests

---

## 🧼 CODE QUALITY RULES

### RULE: FUNCTION_SIZE

- Functions MUST be as small as possible and focused

---

### RULE: NO_DUPLICATION

- Duplicate logic MUST be extracted

---

### RULE: READABILITY

- Code MUST be self-explanatory
- Avoid unnecessary comments

---

## 🔐 VALIDATION RULES

### RULE: VALIDATION_LOCATION

- Validation MUST exist in:
  - utils/validators.ts
  - OR dedicated validator modules

---

---

## 🔁 REUSABILITY ENFORCEMENT

### RULE: REUSE_FIRST

Before writing new logic:

1. Check existing modules
2. Check utils
3. Reuse if possible

---

## 🚫 PROHIBITED PATTERNS

### RULE: NO_MONOLITH_FILES

- DO NOT create large mixed-responsibility files

---

### RULE: NO_GENERIC_FILES

Forbidden:

- helpers.ts
- utils.ts
- common.ts
- misc.ts

---

### RULE: NO_LOGIC_MIXING

- NEVER mix:
  - controller + service logic
  - service + util logic
  - model + business logic

---

## ✅ FINAL ENFORCEMENT

The AI agent MUST ALWAYS:

- Extract highly reusable logic into modules
- Keep modules small and focused
- Use correct export type (default vs named)
- Follow strict layer separation
- Keep controllers thin
- Keep services modular
- Keep utils pure
