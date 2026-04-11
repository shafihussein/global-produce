# AGENT.md

This file consolidates the active guidance from `agentic_rules/` for agents working in this repository.

## Agent Permissions Policy

- For this workspace, agents are authorized to run commands and scripts that read, write, create, move, rename, or delete files inside the repository.
- Destructive workspace commands are allowed when they are directly related to the requested task, including `rm`, `mv`, `cp`, directory cleanup, file replacement, and similar repo-local filesystem operations.
- Agents may run project tooling without asking for permission for this repository, including `git`, `gh`, `npm`, `npx`, `node`, test runners, build commands, lint commands, formatting commands, and repo-local scripts.
- Agents may create branches, commit, pull, push, inspect or update pull requests, inspect or rerun GitHub Actions, and perform related GitHub operations for the repository `shafihussein/global-produce` without asking for permission.
- Agents should assume the user has pre-approved normal coding and repository maintenance commands for this workspace.
- Agents must still avoid unrelated destructive actions and must keep command scope limited to the active task.

## Agent Permissions Policy

- For this workspace, agents are authorized to run commands and scripts that read, write, create, move, rename, or delete files inside the repository.
- Destructive workspace commands are allowed when they are directly related to the requested task, including `rm`, `mv`, `cp`, directory cleanup, file replacement, and similar repo-local filesystem operations.
- Agents may run project tooling without asking for permission for this repository, including `git`, `gh`, `npm`, `npx`, `node`, test runners, build commands, lint commands, formatting commands, and repo-local scripts.
- Agents may create branches, commit, pull, push, inspect or update pull requests, inspect or rerun GitHub Actions, and perform related GitHub operations for the repository `shafihussein/global-produce` without asking for permission.
- Agents should assume the user has pre-approved normal coding and repository maintenance commands for this workspace.
- Agents must still avoid unrelated destructive actions and must keep command scope limited to the active task.

## Project Context

### Architecture

- This is a monorepo with three primary directories: `client/`, `server/`, and `database/`.
- The client is built with Vite and React.
- The server is a Node.js HTTPS backend and contains business logic and data models.
- The database is file-based persistence only. Do not introduce PostgreSQL or other external databases unless explicitly requested.

### Directory Responsibilities

- `client/`: frontend UI
- `server/`: backend logic, models, services, request handling
- `database/`: physical storage for persisted JSON data

### Utilities

- There are no shared utilities across client and server.
- `client/` and `server/` must keep separate `utils/` folders.
- Never reuse `server/` utilities in the client.

### Entry Points and Integration

- Client entry: `client/src/main.jsx`
- Expected backend entry per guide: `server/index.js`
- Client communicates with server over HTTPS.
- Server reads and writes persisted data in `./database`.

### Persistence and Git Tracking

- The `database/` directory structure is tracked.
- Actual JSON data files inside `database/` must not be tracked.
- Models define data structures and mapping for file persistence.

### Tooling

- Jest is the universal testing framework for the project.
- Storybook and Vite are client-only tools.

## Git Protocol

### Preparation and Sync

- Always start on `main`.
- Always run `git pull` on the current branch before creating a new branch.
- Do not switch branches until local sync is complete.
- Remote is the source of truth.
- If a conflict occurs during sync, the guide says to hard overwrite from remote using `git reset --hard origin/<branch-name>`.

### Branching

- Never work directly on `main`.
- Create a new local branch for every task after syncing.
- Branch naming format: `{domain}/{prefix}/{description}`.
- Documentation work may use `docs/` without a client/server domain prefix.
- Descriptions must be lowercase kebab-case.

### Standard Prefixes

- `feature/`
- `bugfix/`
- `hotfix/`
- `test/`
- `chore/`
- `refactor/`
- `release/`
- `docs/`

### Tracking Rules

- Do not track or commit Jest or Storybook files.
- Exclude `.test.js`, `.spec.js`, and `.stories.js` files from commits.

### Completion

- Push the task branch to a remote branch with the exact same name.
- Never push to `main`.

### Cleanup

- After a successful push, switch back to `main`.
- Delete the local task branch.

## Server Rules

### Core Principles

- Code must be modular and organized by responsibility.
- Do not mix responsibilities across layers.
- Reusable logic must be extracted into its own module.
- Prefer small, focused modules.

### Directory Usage

- `controllers/`: request/response handling only
- `services/`: business logic only
- `models/`: data structures/classes only
- `utils/`: reusable pure helper functions only
- `routes/`: endpoint definitions only
- `middleware/`: request pipeline logic
- `types/`: TypeScript types/interfaces

### Layer Boundaries

- Controllers must not contain business logic.
- Controllers must not access the filesystem or models directly.
- Services must not use `req` or `res`.
- Utils must not contain business logic.
- Utils must not depend on controllers or services.
- Models must not contain business logic.
- Models must not perform file operations.
- Models must not call services or utils.

### Naming Conventions

- Service: `<task>Service.ts`
- Controller: `<entity>Controller.ts`
- Route: `<entity>Routes.ts`
- Model: `<Entity>.ts`
- Util: `<functionName>.ts`
- Middleware: `<name>Middleware.ts`
- Test: `<name>.test.ts`
- Functions must use camelCase and clearly describe behavior.

### Controllers

- Controllers may extract request data, call service functions, and return responses.
- Controllers must not perform heavy computation or file operations.

### Services

- Services contain business logic.
- Services orchestrate utils and models.
- Services must be reusable and independent.
- Each service file should focus on one responsibility.
- Larger logic should be split into smaller functions/modules.

### Module Extraction

- If logic is reusable, independent, or used in multiple places, extract it into its own file.
- One module should have one responsibility.
- Do not use vague module names like `helpers.ts`, `utils.ts`, `common.ts`, or `misc.ts`.

### Export Convention

- If used outside `services/`, prefer default export when possible.
- If used only within `services/`, use named exports.

### Utils

- Utils must be pure functions.
- Utils must avoid side effects.
- Utils must not contain business logic.
- One util file should have one responsibility.
- Shared logic must move to utils immediately.
- If logic is local to one file only, place it near the top of that file with a clear comment label.

### Models

- Models must be classes.
- Models represent schema/data only.
- Database persistence is file-based in `./database`.

### File Persistence

- File operations must be isolated.
- Use a dedicated file abstraction such as `fileStore.ts`.
- Services must use the abstraction and must not manipulate raw file structure directly.

### Routes

- Routes define endpoints and attach controllers.
- Routes must not contain logic or call services directly.

### Server Testing

- Each module should have a `.test.ts` file.
- Utils: unit tests
- Services: unit tests
- Models: structure tests

## Client UI Component Rules

### Core Principles

- Prioritize reusability over duplication.
- Keep components small, composable, and maintainable.
- Enforce strict separation of UI and business logic.
- Follow consistent naming and structure.
- Use ES modules only.
- The UI guide specifies vanilla JS, not TypeScript, for client components.
- Optimize state placement to minimize re-renders.

### Reusability

- Always check whether an existing component can be reused before creating a new one.
- Prefer composition over duplication.
- Break UI into small reusable components.
- Even small UI pieces should become components when useful.
- Split into smaller parts in the same file first.
- Only create new component files when reuse is clear and necessary.

### Exports

- Use ES module syntax only.
- Default export: main component.
- Named exports: reusable subcomponents.

### Styling

- Use `styled-components`.
- Define styled components outside the React component but in the same file.
- Use mobile-first design.
- If styles are unspecified, choose accessible and balanced defaults.

### Component File Order

- imports
- styled components
- reusable subcomponents
- component function
- export

### Hooks

- Hooks must be at the top of the component.
- Never call hooks in conditions or loops.
- Custom hooks are not allowed.
- Do not introduce `client/src/hooks`.
- Keep hooks inside components only.

### Event Handlers

- Use `handle<Event>` naming such as `handleClick`, `handleSubmit`, and `handleChange`.

### UI vs Business Logic

- No business logic inside components.
- Allowed UI logic: local state, toggles, form handling.
- Search `client/src/utils` before adding new utility logic.
- If missing, create a new client utility in `client/src/utils`.
- Never use server utilities in the client.
- No API calls directly inside components.
- Use a client service layer such as `client/src/services`.

### State Management

- Put state at the appropriate level in the tree.
- Lift state to the nearest common parent when shared.
- Avoid unnecessary prop drilling.
- Avoid storing derived values in state.
- Compute derived values directly.
- Keep state minimal.

### Side Effects

- All side effects must be inside `useEffect`.
- Never run side effects during render.

### Component Size

- If a component grows large, split it into smaller components.
- Keep the smaller pieces in the same file first.

### Naming and Constants

- Use clear descriptive variable names.
- Boolean names should read like `isLoading`, `isOpen`, `hasError`.
- Do not hardcode values inside components.
- Extract constants to the top of the file or to utils.

### JSX Rules

- Avoid inline functions in JSX.
- Prefer named handlers.
- Reduce arrow function usage and prefer the `function` keyword where practical.

### Import Order

1. External libraries
2. Internal modules such as utils and services
3. Styled components

### Props

- Always destructure props.
- Keep props minimal and explicit.
- Avoid deep prop drilling where possible.

### Accessibility

- Buttons must include a `type` attribute.
- Inputs must have labels or `aria-label`.
- Use `aria-*` attributes when needed.

### Loading and Error States

- Every component must handle loading states.
- Every component must handle error states.
- UI feedback should be clear.

### Client Testing and Storybook

- All logic and UI must be tested thoroughly.
- Cover happy paths, edge cases, and failure scenarios.
- Every utility should have a Jest test file named `<fileName>.test.js`.
- Every component should have a Storybook file named `ComponentName.stories.jsx`.
- Stories should include default state, variants, and realistic examples.
- Storybook is the primary UI validation tool.

### Client Folder Patterns

- The guide proposes a component folder pattern:
  - `ComponentName/`
  - `ComponentName.jsx`
  - `ComponentName.stories.jsx`
  - `index.js`
- Components and related tests/stories should be co-located.

### Assets and Design References

- Assets such as icons, logos, and media belong in `client/src/assets`.
- Refer to `./designs/UI` for visual design references when available.

## Empty Source Files

- `agentic_rules/constraints.md` was empty at merge time.
- `agentic_rules/standards.md` was empty at merge time.

## Practical Priority Order

When the guidance conflicts or overlaps, follow this order:

1. Project context and architecture boundaries
2. Git workflow rules
3. Server layer separation and persistence rules
4. Client component reuse and UI structure rules
5. Empty files add no active constraints until populated
