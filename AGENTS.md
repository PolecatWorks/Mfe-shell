# Agent Workspace Guidance & Specification Rules (`Mfe-shell`)

> [!IMPORTANT]
> **Core Workflow Rule**: **Update PRDs First** (`spec/prds/`) $\rightarrow$ **Derive Spec** (`spec/specs/`) $\rightarrow$ **Build Out** (Strict TDD Implementation).
> Never jump directly into source code implementation without completing and validating the PRD and Spec phases first.

## Communication & Diagramming Standards
- **Relative Markdown Links**: Use relative Markdown links for file cross-references (e.g. `[PRD Index](./spec/prds/README.md)`). Do NOT use `file:///` URLs inside Markdown files.
- **Mermaid Diagrams**: Use Mermaid diagrams (`mermaid` code blocks) when describing system architectures, data flows, sequence flows, or lifecycles.

## Workflow & Branch Rules
- **Feature Branch & PR Workflow**: **Do NOT push directly to `main`**. Always create a dedicated feature branch, commit changes, push to `origin`, and open a Pull Request via `gh pr create`.
- **Spec Status Lifecycle (`draft` -> `complete` -> `deprecated`)**: Only modify specs in `draft` status; preserve `complete` specs for auditability.
- **PRD Maintenance**: Keep [spec/prds/README.md](./spec/prds/README.md) and [spec/specs/README.md](./spec/specs/README.md) indexed whenever PRDs or specs are added or modified.

## Boot-Time Validation & Code Refinement Standards

- **Fail-Fast Boot & Initialization**: Validate all required runtime configuration (`auth-config.json`, `shell-config.json`, OIDC issuer/client settings, and federation remotes) during application bootstrap before mounting routes or reporting healthy.
- **No Config Defaults / No Soft-Fail**: Operational configuration fields must be explicitly defined and validated. Never fall back to mock credentials, placeholder URLs, or default auth states when configuration loading or validation fails—surface a fatal configuration error immediately.
- **Minimize Optional Plumbing (`undefined` / `null` / `Option<T>`)**: Never model required runtime dependencies or bootstrap config as optional. Use optionality only where absence is a valid domain state (e.g., optional filter parameters or lookup results).
- **Propagate Errors Cleanly & Never Swallow Errors**: Propagate typed errors cleanly to boundary error handlers instead of wrapping them in redundant branching or silently discarding failures (no empty `catch {}` blocks or `.catch(() => default)` fallbacks on required operations).
- **Parse, Don't Validate & Minimize Ambiguity**: Validate and type external payloads (`UserContext`, `ShellConfig`, `MfeCanvasController` patches) once at the boundary; avoid stringly-typed flags, duplicate routes, or ambiguous fallback behavior.

## Architecture & Testing Guidelines
- **Portal Host (`mfe-shell-container`)**: Angular 21 + `@angular-architects/native-federation` + `angular-oauth2-oidc` + `@polecatworks/mfe-shared`.
- **Shared Library (`mfe-shell-container/projects/mfe-shared`)**: Singleton `@polecatworks/mfe-shared` package providing `SharedContextService`, `SharedHttpService`, `SharedOtelService`, and `SharedCanvasService`.
- **Widget Remote (`mfe1-container`)**: Exposes `MfeCanvasController` wrappers consumed by `Angry-agent`'s shared canvas.
- **Zero Fake Auth**: Never introduce mock logins, hardcoded tokens, or `localStorage` auth bypasses.
