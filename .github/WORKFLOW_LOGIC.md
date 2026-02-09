# MFE1 CI/CD Logic

This document describes the logic for the **MFE1** Continuous Integration workflows. The logic is split into two separate workflows to handle Pull Requests and Main Branch merges independently.

## 1. Pull Request Flow (`mfe1-ci-pr.yml`)

This workflow triggers on `pull_request` events targeting `main`. Its primary goal is to verify that changes (in MFE1 or the Shell) build correctly before merging.

### Logic Diagram

```mermaid
flowchart TD
    Start([PR Event]) --> CheckPaths{Shell Changed?}

    %% Decision: Wait or Skip
    CheckPaths -->|Yes| WaitShell[**Wait for Shell Workflow**<br/>Target: PR Head SHA]
    CheckPaths -->|No| SkipWait[**Skip Wait**]

    %% Input Image Selection
    WaitShell --> UseDevInput[**Input Image**<br/>Repo: `...-mfe-shell/dev`<br/>Tag: `sha-CONTENT_SHA`]
    SkipWait --> UseMainInput[**Input Image**<br/>Repo: `...-mfe-shell`<br/>Tag: `main`]

    %% Build & Output
    UseDevInput --> Build[**Build MFE1**]
    UseMainInput --> Build

    Build --> Output[**Push Output Image**<br/>Repo: `...-mfe1/dev`<br/>Tag: `sha-COMMIT_SHA`]

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef action fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef decision fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class WaitShell,Build,SkipWait action;
    class CheckPaths decision;
    class Output output;
```

### Key Behaviors
*   **Wait Trigger**: Only waits if `mfe-shell` files are modified. Waits for the specific PR Head commit to match the current context.
*   **Shell Image**:
    *   **Changed**: Uses the `dev` image built from the specific content SHA (`dev:sha-<SHA>`).
    *   **Unchanged**: Uses the stable `main` image to save time.
*   **Output**: Always pushes to the development registry (`.../dev`).

---

## 2. Main Branch Flow (`mfe1-ci-main.yml`)

This workflow triggers on `push` events to `main`. It handles production builds and deployment artifacts.

### Logic Diagram

```mermaid
flowchart TD
    Start([Push to Main]) --> CheckPaths{Shell Changed?}

    %% Decision: Wait or Skip
    CheckPaths -->|Yes| WaitShell[**Wait for Shell Workflow**<br/>Target: Commit SHA]
    CheckPaths -->|No| SkipWait[**Skip Wait**]

    %% Input Image Selection
    WaitShell --> UseProdInput[**Input Image**<br/>Repo: `...-mfe-shell`<br/>Tag: `sha-CONTENT_SHA`]
    SkipWait --> UseMainInput[**Input Image**<br/>Repo: `...-mfe-shell`<br/>Tag: `main`]

    %% Build & Output
    UseProdInput --> Build[**Build MFE1**]
    UseMainInput --> Build

    Build --> Output[**Push Output Image**<br/>Repo: `...-mfe1`<br/>Tags: `main`, `latest`, `sha-COMMIT_SHA`]

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef action fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef decision fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class WaitShell,Build,SkipWait action;
    class CheckPaths decision;
    class Output output;
```

### Key Behaviors
*   **Wait Trigger**: Only waits if `mfe-shell` files are modified in the commit.
*   **Shell Image**:
    *   **Changed**: Uses the production image built from the specific content SHA (`sha-<SHA>`).
    *   **Unchanged**: Uses the stable `main` image.
*   **Output**: Pushes to the production registry with `main`, `latest`, and `sha-<SHA>` tags.
