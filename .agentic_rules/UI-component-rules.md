Great additions — these are exactly the kind of rules that improve performance and consistency. I’ve integrated them cleanly into your existing system and kept the tone strict and agent-friendly.

Here is the **updated full markdown snippet with your new rules included**:

````markdown id="r9k2va"
# UI Component Rules (React + Vite, Vanilla JS)

## 🔴 Core Principles

- Prioritize **reusability over duplication**
- Keep components **small, composable, and maintainable**
- Enforce **strict separation of UI and business logic**
- Follow **consistent structure and naming conventions**
- Use **ES Modules only**
- **no TypeScript**, just Vanilla JS
- Optimize for **minimal re-renders and performance** by placing states at the right component

---

## 1. Component Reusability (MANDATORY)

- ALWAYS check if an existing component can be reused before creating a new one
- Prefer **composition over duplication**
- Break UI into **small, reusable components**
- Even small UI parts (buttons, inputs, sections) should be components

### Same File Decomposition Rule

- Split components into smaller parts **within the same file first**
- Do NOT create new files unless reuse is clear and necessary

```jsx
const ParentComponent = () => {
  return (
    <Wrapper>
      <Header />
      <Content />
    </Wrapper>
  );
};

const Header = () => {
  /* ... */
};
const Content = () => {
  /* ... */
};

export default ParentComponent;
```

---

## 2. Export Strategy (ES Modules)

- Use **ES module syntax only**
- Use:
  - **default export** → main component
  - **named exports** → reusable subcomponents

```jsx
const Button = ({ label, onClick }) => {
  /* ... */
};

const IconButton = ({ icon, onClick }) => {
  /* ... */
};

export default Button;
export { IconButton };
```

---

## 3. Styling

- Use **styled-components**
- Define all styled components:
  - **outside** the React component
  - in the **same file**
- Use **mobile-first design**
  - Start with base styles for small screens
  - Use media queries for larger screens

- If styles are not specified:
  - Apply clean, accessible, and visually balanced defaults

---

## 4. Component Structure (STRICT ORDER)

```jsx
// imports

// styled components

// reusable subcomponents

const ComponentName = ({ ...props }) => {
  // hooks

  // derived values

  // event handlers

  // minimal helpers

  return (
    // JSX
  );
};

export default ComponentName;
```

---

## 5. Hooks Rules

- Hooks MUST:
  - Be at the **top of the component**
  - Never be inside conditions or loops
- Custom hooks are NOT allowed
  - This project does NOT use `client/src/hooks`
  - All hooks must remain inside components only

---

## 6. Event Handler Naming

- MUST follow:

```
handle<Event>
```

### Examples:

- `handleClick`
- `handleSubmit`
- `handleChange`

---

## 7. Logic Separation (STRICT)

- ❌ NO business logic inside components
- ✅ ONLY UI logic allowed:
  - local state
  - toggles
  - form input handling

### Required Workflow:

1. Search in: `client/src/utils`
2. If exists → reuse
3. If not → create new utility in:

```
client/src/utils
```

- NEVER use `server/` utilities

---

## 8. State Management & Prop Drilling (PERFORMANCE CRITICAL)

- State MUST be placed at the **appropriate level in the component tree**

### Rules:

- Lift state up to the **nearest common parent** when shared
- Avoid unnecessary prop drilling
- Avoid placing state too high (causes unnecessary re-renders)
- Avoid placing state too low (causes duplication or sync issues)

### Goal:

- Minimize unnecessary re-renders
- Ensure efficient updates in deeply nested components

---

## 9. Testing (MANDATORY & EXTENSIVE)

### General Rule

- ALL logic and UI MUST be tested thoroughly
- Tests must cover:
  - happy paths
  - edge cases
  - failure scenarios

### 9.1 Logic Testing (Jest)

- Use Jest
- Every utility MUST have a test file

#### Naming Convention:

```
<fileName>.test.js
```

#### Examples:

```
DateConvertor.js → DateConvertor.test.js
emailValidator.js → emailValidator.test.js
```

- Tests MUST:
  - Validate all inputs
  - Cover edge cases
  - Cover failure scenarios
  - Avoid untested branches

---

### 9.2 UI Testing (Storybook)

- Every component MUST have a Storybook file:

```
ComponentName.stories.jsx
```

- Stories MUST include:
  - Default state
  - Variants (e.g., disabled, loading, error)
  - Realistic usage examples

- Storybook is the **primary UI validation tool**

---

## 10. Folder Structure

```
ComponentName/
  ComponentName.jsx
  ComponentName.stories.jsx
  index.js
```

---

## 11. Props Rules

- Always destructure props
- Keep props minimal and explicit
- Avoid deep prop drilling where possible

---

## 12. Accessibility (MANDATORY)

- Buttons MUST include:
  - `type` attribute

- Inputs MUST:
  - Have labels OR `aria-label`

- Use `aria-*` attributes when necessary

---

## 13. State Management

- Keep state minimal
- DO NOT store derived values in state
- Compute derived values directly

---

## 14. Side Effects

- All side effects MUST be inside `useEffect`
- NEVER run side effects during render

---

## 15. API Calls

- ❌ No API calls inside components
- ✅ Use:
  - service layer (`client/src/services`)

---

## 16. Component Size Rule

- If component becomes large:
  - Split into smaller components
  - Keep them in the **same file first**

---

## 17. Naming Conventions

- Boolean variables:
  - `isLoading`, `isOpen`, `hasError`

- Use clear, descriptive names:
  - ❌ `data`, `value2`
  - ✅ `userEmail`, `formState`

---

## 18. No Inline Functions in JSX

❌ Avoid:

```jsx
<button onClick={() => doSomething()} />
```

✅ Use:

```jsx
const handleClick = () => doSomething();
```

Please reduce arrow functions, use `function` keyword

## 19. Import Order

1. External libraries
2. Internal modules (utils, services)
3. Styled components

---

## 20. Constants Rule

- Do NOT hardcode values inside components
- Extract constants to:
  - top of file OR
  - utils

---

## 21. Error & Loading Handling

- Every component MUST handle:
  - loading states
  - error states

- Provide clear UI feedback

---

## 22. project assets

All assets inlcuding icons, logos, media. etc are in `./client/src/assets`

## 23. check .designs/UI for UI design templates

for reference like styles, please refer to UI designs in ./designs/UI for components designs and use the design for reference to styles and look.

## ✅ Final Enforcement Summary

The agent MUST:

- Build **reusable, composable components**
- Keep **logic outside UI**
- Optimize **state placement to reduce re-renders**
- Avoid unnecessary **prop drilling**
- Use **mobile-first styling**
- Use **hooks only inside components (no custom hooks)**
- Use **consistent structure and naming**
- Write **extensive tests (Jest + Storybook)**
- Follow **strict file and folder conventions**
````
