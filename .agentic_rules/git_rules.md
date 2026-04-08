# Git Protocol

## 1. Preparation & Synchronization (Source of Truth)

- **Sync First:** Synchronize the current environment before beginning any task.
- **always start in `main` and pull remote before creating new branch** .
- **The Command:** Perform a `git pull` directly on the current branch.
- **No Premature Switching:** Do not switch branches until the local environment is successfully synced.
- **Conflict Resolution:** If a conflict occurs, perform a **hard overwrite** using the remote version: `git reset --hard origin/<branch-name>`.
- **Authority:** Remote work is the absolute source of truth.

## 2. Branching & Naming Convention

- **Main Protection:** Strictly forbidden from working on or pushing to the `main` branch.
- **New Work Branches:** Create a new local branch for every task after synchronization.
- **Domain Prefixing:** Every branch name must start with `client/` or `server/` depending where work is done in. for example **refactor work done in server is prefixed with `server` becoming `server/refactor/a-clear-description-of-what-is-don` be as descriptive as possible**
  - **Exception:** Documentation tasks using the `docs/` prefix do **not** require a domain prefix.
- **Structural Format:** `{domain}/{prefix}/{description}`
- **Some Standard Prefixes:**
  - `feature/`: New development or improvements.
  - `bugfix/`: Standard fixes for non-critical bugs.
  - `hotfix/`: Urgent repairs for critical issues.
  - `test/`: Updates for Storybook, Jest configs, or test suites.
  - `chore/`: Tooling, dependencies, or configuration updates.
  - `refactor/`: Restructuring code without changing functionality.
  - `release/`: Final preparations for production.
  - `docs/`: Updates specifically for documentation.
- **Formatting:** Descriptions must be lowercase and use kebab-case (e.g., `server/test/add-integration-suite`).

## 3. Files & Tracking

- **Test Exclusion:** Do not track or commit files related to **Jest** or **Storybook**.
- **Co-location Awareness:** `jest` files live next to the source (e.g., `example.js` and `example.test.js`).
- **Constraint:** Strictly exclude `.test.js`, `.spec.js`, and `.stories.js` files from the git index during commits.

## 4. Completion & Pushing

- **Remote Sync:** Once the task is finished, push the branch to the remote repository.
- **Name Match:** The remote branch name must be an exact match of the local branch name.
- **No Main Pushing:** Never attempt to push to `main`.

## 5. Cleanup

- **Return to Base:** After a successful push, switch back to the `main` branch.
- **Pruning:** Delete the local branch: `git branch -d <branch-name>`.
