# Component Library Project Instructions

## Project context

- This repository is a React 19 + TypeScript + Vite component library.
- Prefer small, reusable, composable primitives over large monolithic components.
- Keep the public API clean and modern. Avoid legacy GT-prefixed names in new code and prefer names like DataTable, DataGrid, FilterText, Pagination, and RowCountDropdown.
- Use the design-system tokens and CSS custom properties instead of hardcoded colors, spacing, borders, or typography values.

## Quality bar

- Favor WCAG-friendly accessibility: semantic HTML, visible focus states, keyboard support, labels, and sufficient contrast.
- Make interfaces highly configurable without sacrificing clarity. Support density, padding, font-size scaling, and color personalization through tokens and props.
- Prefer UX patterns that feel polished and predictable: clear hover and focus states, consistent spacing, and explicit affordances for actions.
- Default UI should be usable out of the box, but allow users to replace entire sections such as filters, toolbar, or pagination with custom implementations.

## Data table expectations

- Treat the table as a compound, feature-rich component rather than a single rigid view.
- Keep rendering efficient by reducing unnecessary re-renders, memoizing derived data, and avoiding work in render paths when state can be computed once.
- Maintain a clear separation between data state, view state, and rendered controls.
- Preserve default filter and pagination controls but support replacing them with custom render props or injected components.
- Keep row selection, filtering, sorting, and pagination logic predictable and state-driven.

## Code standards

- Prefer TypeScript types over implicit any.
- Keep component props explicit and easy to understand.
- Favor composition and slots over one-off conditional logic.
- Prefer memoization for expensive derived values when input sets are large.
- If a symbol is part of the public API, export it from the main barrel file.
- Preserve backward compatibility when refactoring existing APIs, but do not introduce new GT-prefixed patterns.

## Project standards

- type: component library
- status: active
- rules:
  - Keep the public component API backward compatible.
  - Use compound components for configurable widgets.
  - Use semantic HTML and keyboard-accessible interactions.
  - Remove stale imports after renames.
  - Run typecheck, build, and browser tests before completing changes.

## Validation

- npm run typecheck
- npm run build
- npm test
- Run the relevant checks before claiming work is complete.
- If a change affects component behavior or exports, confirm the build still succeeds after the update.
