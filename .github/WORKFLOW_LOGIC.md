# MFE1 CI/CD Logic

This document describes the logic for the **MFE1** Continuous Integration workflows. The logic is split into two separate workflows to handle Pull Requests and Main Branch merges independently.

## 1. Pull Request Flow (`mfe1-ci-pr.yml`)

This workflow triggers on `pull_request` events targeting `main`. Its primary goal is to verify that changes (in MFE1 or the Shell) build correctly before merging.

### Logic Diagram

```mermaid
flowchart TD
    Start([PR Event]) --> CheckPaths{Changes?}

    CheckPaths -->|Yes| CalcSHA[Calculate Content SHA]
    CheckPaths -->|No| Skip([Skip])

    CalcSHA --> Build[**Build MFE1**]

    Build --> Output[**Push Output Image**<br/>Repo: `...-mfe1/dev`<br/>Tag: `sha-COMMIT_SHA`]

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef action fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class CalcSHA,Build action;
    class Output output;
```

### Key Behaviors
*   **Shell Image**: No longer depends on the shell image or waits for shell CI. Instead, it pulls `@polecatworks/mfe-shared` directly from the GitHub Packages NPM registry via an injected token.
*   **Output**: Always pushes to the development registry (`.../dev`).

---

## 2. Main Branch Flow (`mfe1-ci-main.yml`)

This workflow triggers on `push` events to `main`. It handles production builds and deployment artifacts.

### Logic Diagram

```mermaid
flowchart TD
    Start([Push to Main]) --> CheckPaths{Changes?}

    CheckPaths -->|Yes| CalcSHA[Calculate Content SHA]
    CheckPaths -->|No| Skip([Skip])

    CalcSHA --> Build[**Build MFE1**]

    Build --> Output[**Push Output Image**<br/>Repo: `...-mfe1`<br/>Tags: `main`, `latest`, `sha-COMMIT_SHA`]

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef action fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class CalcSHA,Build action;
    class Output output;
```

### Key Behaviors
*   **Shell Image**: No longer depends on the shell image or waits for shell CI. Instead, it pulls `@polecatworks/mfe-shared` directly from the GitHub Packages NPM registry via an injected token.
*   **Output**: Pushes to the production registry with `main`, `latest`, and `sha-<SHA>` tags.


# MFE Shell CI Logic

The MFE Shell workflows are responsible for building the base shell image consumed by consumers, as well as publishing the `mfe-shared` NPM library.

## 3. Shell PR Flow (`mfe-shell-ci-pr.yml` & `mfe-shared-publish-pr.yml`)

Triggers on `pull_request` to `main` when shell or shared library files change.

### Logic Diagram

```mermaid
flowchart TD
    Start([PR Event]) --> CheckPaths{Changes?}

    CheckPaths -->|Shell files| CalcSHA[Calculate Content SHA]
    CheckPaths -->|Shared files| CalcSharedSHA[Calculate Shared SHA]

    CalcSHA --> Build[**Build Shell Image**]
    CalcSharedSHA --> BuildShared[**Publish mfe-shared NPM**]

    Build --> Output[**Push Output Image**<br/>Repo: `...-mfe-shell/dev`<br/>Tag: `sha-CONTENT_SHA`]
    BuildShared --> SharedOutput[**Push NPM Package**<br/>Tags: `0.0.0-pr-NUM`, `0.0.0-sha-SHA`]

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef action fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class CalcSHA,Build,CalcSharedSHA,BuildShared action;
    class Output,SharedOutput output;
```

*   **Output**: Pushes shell image to `...-mfe-shell/dev`. Pushes `@polecatworks/mfe-shared` to GitHub Packages NPM registry.
*   **Tagging**: Uses the SHA of the specific changed directory to ensure the tag is content-addressable. `mfe-shared` is also tagged with the PR number.

## 4. Shell Main Flow (`mfe-shell-ci-main.yml` & `mfe-shared-publish-main.yml`)

Triggers on `push` to `main` when shell or shared library files change.

### Logic Diagram

```mermaid
flowchart TD
    Start([Push to Main]) --> CheckPaths{Changes?}

    CheckPaths -->|Shell files| CalcSHA[Calculate Content SHA]
    CheckPaths -->|Shared files| CalcSharedSHA[Calculate Shared SHA]

    CalcSHA --> Build[**Build Shell**]
    CalcSharedSHA --> BuildShared[**Publish mfe-shared NPM**]

    Build --> Output[**Push Output Image**<br/>Repo: `...-mfe-shell`<br/>Tags: `main`, `latest`, `sha-CONTENT_SHA`]
    BuildShared --> SharedOutput[**Push NPM Package**<br/>Tags: `0.0.0-main`, `0.0.0-sha-SHA`]

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef action fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class CalcSHA,Build,CalcSharedSHA,BuildShared action;
    class Output,SharedOutput output;
```

*   **Output**: Pushes shell image to `...-mfe-shell` (prod). Pushes `@polecatworks/mfe-shared` to GitHub Packages NPM registry.
*   **Tagging**: Updates `main` and `latest` tags for Docker image, and `0.0.0-main` for the NPM package.

---

## 5. Automated Deployment Flow (`update-fluxcd.yml`)

This workflow triggers on `push` to `main` when any of the Docker containers or CI workflows for `mfe-shell`, `mfe1`, or `mfe2` are modified. Its goal is to synchronize the new Docker image tags with the FluxCD manifests repository and automatically propose a deployment.

### Logic Diagram

```mermaid
flowchart TD
    Start([Push to Main]) --> CheckPaths{Which Apps Changed?}

    CheckPaths --> |MFE Shell| WaitShell[Wait for Shell CI]
    CheckPaths --> |MFE 1| WaitMFE1[Wait for MFE1 CI]
    CheckPaths --> |MFE 2| WaitMFE2[Wait for MFE2 CI]

    WaitShell --> GetSHAs[Get Last Git Commit SHAs]
    WaitMFE1 --> GetSHAs
    WaitMFE2 --> GetSHAs

    GetSHAs --> InjectTags[Inject Tags into FluxCD YAMLs via yq]

    InjectTags --> CheckDiff{Are Tags Different?}

    CheckDiff --> |Yes| CreatePR[Create Auto-Merging PR]
    CheckDiff --> |No| Skip([Skip])

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef action fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef decision fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef output fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class WaitShell,WaitMFE1,WaitMFE2,GetSHAs,InjectTags,CreatePR action;
    class CheckPaths,CheckDiff decision;
```

### Key Behaviors
*   **Conditional Waiting**: The script inspects the path-checker outputs and dynamically waits only for the specific CI workflows that were expected to run in this commit, pausing up to 30 minutes.
*   **Skip Cascading Immunity**: When apps like MFE1 or MFE2 do not detect any shell dependency updates, their local `wait-for-shell` jobs internally bypass their steps rather than returning a "Skipped" status. This prevents GitHub Actions from skip-cascading and failing the entire CI workflow run.
*   **Git Log SHA Matching**: Because Docker images are tagged with the specific commit SHA that last altered their contents, `update-fluxcd.yml` extracts the same SHA using `git log -1` tailored to that component's files.
*   **Unconditional Updates**: The workflow unconditionally writes these SHAs to all three `mfe-shell.yaml`, `mfe1.yaml`, and `mfe2.yaml` manifests in `fluxcd-dev`. It relies on `git diff` to naturally ignore any file that hasn't actually mutated.
