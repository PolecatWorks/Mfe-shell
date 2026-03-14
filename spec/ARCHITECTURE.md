# MFE Shell - Architecture Overview

**Document Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-03-14  

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [System Components](#system-components)
3. [Micro Frontend Remotes](#micro-frontend-remotes)
4. [Module Federation](#module-federation)
5. [Shared Library Pattern](#shared-library-pattern)
6. [Deployment Architecture](#deployment-architecture)
7. [Data Flow](#data-flow)
8. [Technology Stack](#technology-stack)

---

## High-Level Architecture

### System Overview

```mermaid
graph TB
    User["👤 User Browser"]
    
    subgraph "Host Application"
        Shell["🏠 Shell Container<br/>(Angular 21 Host)<br/>Port 4200"]
        ShellRouter["Dynamic Router<br/>shell-config.json"]
        Shell --> ShellRouter
    end
    
    subgraph "Shared Resources"
        MfeShared["📦 mfe-shared<br/>(Singleton Library)<br/>npm link"]
    end
    
    subgraph "Micro Frontends"
        MFE1["🔵 MFE1 Container<br/>(Angular 21 Remote)<br/>Port 3000"]
        MFE2["🟣 MFE2 Container<br/>(React 18 Remote)<br/>Port 3002"]
    end
    
    User -->|"HTTP Requests"| Shell
    Shell -->|"Consumes"| MfeShared
    MFE1 -->|"Consumes"| MfeShared
    Shell -->|"Federation Links<br/>(remoteEntry.json)"| MFE1
    Shell -->|"Federation Links<br/>(remoteEntry.json)"| MFE2
    
    style Shell fill:#4A90E2
    style MFE1 fill:#6B5B95
    style MFE2 fill:#9B59B6
    style MfeShared fill:#F39C12
```

**Key Characteristics:**
- **Host:** Angular 21 shell application serving as the federated host
- **Remotes:** Angular and React micro frontends dynamically loaded at runtime
- **Shared State:** Singleton library (mfe-shared) for state consistency
- **Configuration-Driven:** Runtime configuration for MFE discovery (no code changes needed)

---

## System Components

### 1. Shell Container (Host Application)

```mermaid
graph LR
    Bootstrap["Bootstrap<br/>main.ts"]
    
    subgraph "Shell Application"
        AppComponent["🎯 AppComponent<br/>(root)"]
        Navigator["Navigation Module<br/>(menu, routing)"]
        Router["Dynamic Router<br/>(loadRemote)"]
        Config["Configuration Service<br/>(shell-config.json)"]
    end
    
    subgraph "Utilities"
        Logging["Logging Service"]
        HTTP["HTTP Interceptors"]
        Auth["OAuth2 Service"]
    end
    
    Bootstrap --> AppComponent
    AppComponent --> Navigator
    AppComponent --> Router
    Router --> Config
    AppComponent --> Logging
    AppComponent --> HTTP
    AppComponent --> Auth
    
    style Bootstrap fill:#2196F3
    style AppComponent fill:#4A90E2
    style Router fill:#FF9800
    style Config fill:#F39C12
```

**Responsibilities:**
- **Bootstrap:** Initialize the federated host
- **Navigation:** Manage top-level navigation and menu
- **Dynamic Routing:** Load and render remotes based on routes
- **Configuration:** Read runtime configuration for MFE discovery
- **Shared Services:** Provide logging, HTTP, authentication

**Location:** `mfe-shell-container/src/app/`

---

### 2. MFE1 - Angular Remote

```mermaid
graph LR
    Bootstrap["Bootstrap<br/>remoteEntry.ts"]
    
    subgraph "MFE1 Application"
        Module["Angular Module<br/>(lazy-loadable)"]
        Routes["Routes"]
        Components["Components"]
        Services["Services"]
    end
    
    subgraph "Shared Resources"
        SharedLib["mfe-shared<br/>(npm link)"]
    end
    
    Bootstrap --> Module
    Module --> Routes
    Module --> Components
    Module --> Services
    Components -.->|"Consume"| SharedLib
    Services -.->|"Inject"| SharedLib
    
    style Bootstrap fill:#9B59B6
    style Module fill:#8E44AD
    style SharedLib fill:#F39C12
```

**Characteristics:**
- **Framework:** Angular 21
- **Module Exposed:** Exposes lazy-loadable module for host
- **Shared Library:** Consumes mfe-shared for state consistency
- **Testing:** Karma/Jasmine for unit tests
- **Port:** 3000 (development) / 8080 (Docker internal)

**Location:** `mfe1-container/src/app/`

---

### 3. MFE2 - React Remote

```mermaid
graph LR
    Bootstrap["Bootstrap<br/>remoteEntry.js"]
    
    subgraph "MFE2 Application"
        App["React App<br/>(root component)"]
        Routes["React Router<br/>(pages)"]
        Components["Components"]
        State["Local State<br/>(context)"]
    end
    
    subgraph "Host Wrapper"
        AngularWrapper["GenericMfeWrapper<br/>(Angular component)"]
    end
    
    Bootstrap --> App
    App --> Routes
    App --> Components
    App --> State
    AngularWrapper -->|"Mounts"| App
    
    style Bootstrap fill:#E91E63
    style App fill:#E91E63
    style AngularWrapper fill:#4A90E2
```

**Characteristics:**
- **Framework:** React 18
- **Module Exposed:** Exposes App component for host
- **Wrapper:** GenericMfeWrapperComponent handles React integration
- **State:** Local React context (not linked to mfe-shared by design)
- **Testing:** None configured (identified as gap)
- **Port:** 3002 (development) / 8080 (Docker internal)

**Location:** `mfe2-container/src/`

---

### 4. Shared Library (mfe-shared)

```mermaid
graph TB
    BuildTarget["Build Target<br/>@angular-architects/ngx-build-plus"]
    
    subgraph "Shared Library Structure"
        Public["Public API<br/>(index.ts)"]
        
        subgraph "Services"
            Context["SharedContextService<br/>(UserContext)"]
            HTTP["SharedHttpService<br/>(interceptors)"]
            Logging["LoggingService"]
        end
        
        subgraph "Models"
            User["UserContext Interface"]
            Config["AppConfig Interface"]
        end
        
        subgraph "Utilities"
            Cache["CacheService"]
            Format["Formatting Utils"]
        end
    end
    
    BuildTarget --> Public
    Public --> Context
    Public --> HTTP
    Public --> Logging
    Public --> User
    Public --> Config
    Public --> Cache
    Public --> Format
    
    style Public fill:#F39C12
    style Context fill:#FF6B6B
    style HTTP fill:#4ECDC4
    style User fill:#95E1D3
```

**Characteristics:**
- **Type:** Singleton library (via npm link)
- **Purpose:** Share state and services across Shell and MFE1
- **Linking:** Must run `make mfe1-shared` before starting
- **Served As:** npm local dependency with file: protocol
- **Packages:** SharedContextService, SharedHttpService, UserContext

**Location:** `mfe-shell-container/projects/mfe-shared/`

---

## Micro Frontend Remotes

### Runtime Configuration (shell-config.json)

```mermaid
graph LR
    Config["shell-config.json<br/>(runtime config)"]
    
    subgraph "MFE Configuration"
        MFE1Def["MFE1 Definition<br/>- name<br/>- remoteEntry URL<br/>- routes"]
        MFE2Def["MFE2 Definition<br/>- name<br/>- remoteEntry URL<br/>- routes"]
    end
    
    subgraph "Menu Configuration"
        MenuItems["Menu Items<br/>- label<br/>- route<br/>- icon"]
    end
    
    Config --> MFE1Def
    Config --> MFE2Def
    Config --> MenuItems
    
    style Config fill:#F39C12
    style MFE1Def fill:#8E44AD
    style MFE2Def fill:#E91E63
    style MenuItems fill:#2196F3
```

**Key Feature:** Configuration-driven MFE discovery enables:
- Adding new MFEs without code changes
- Runtime route registration
- Dynamic menu generation
- Environment-specific configurations (dev/staging/prod)

---

## Module Federation

### Federation Architecture

```mermaid
graph TB
    subgraph "Build Time"
        ShellFed["Shell Federation Config<br/>(@angular-architects/native-federation)"]
        MFE1Fed["MFE1 Federation Config<br/>(exposes module)"]
        MFE2Fed["MFE2 Federation Config<br/>(exposes module)"]
    end
    
    subgraph "Artifacts"
        ShellDist["Shell dist/<br/>- app code<br/>- importmap.json"]
        MFE1Dist["MFE1 dist/<br/>- remoteEntry.json<br/>- module code"]
        MFE2Dist["MFE2 dist/<br/>- remoteEntry.json<br/>- module code"]
    end
    
    subgraph "Runtime - Host Bootstrap"
        LoadImportMap["Load importmap.json"]
        FetchRemotes["Fetch remoteEntry.json"]
        MergeMaps["Merge import maps"]
        Bootstrap["Bootstrap Shell"]
    end
    
    ShellFed --> ShellDist
    MFE1Fed --> MFE1Dist
    MFE2Fed --> MFE2Dist
    
    ShellDist --> LoadImportMap
    MFE1Dist --> FetchRemotes
    MFE2Dist --> FetchRemotes
    FetchRemotes --> MergeMaps
    MergeMaps --> Bootstrap
    
    style ShellFed fill:#4A90E2
    style MFE1Fed fill:#8E44AD
    style MFE2Fed fill:#E91E63
    style Bootstrap fill:#F39C12
```

**Key Points:**
- **Standard:** Uses @angular-architects/native-federation (not Webpack-dependent)
- **Dynamic Loading:** Remotes loaded at runtime via remoteEntry.json
- **Import Maps:** ES module import maps for module resolution
- **Decoupled:** MFEs built independently, referenced dynamically

---

## Shared Library Pattern

### npm link Mechanism

```mermaid
sequenceDiagram
    participant User as Developer
    participant Shell as Shell Container
    participant MFE1 as MFE1 Container
    participant Shared as mfe-shared Build
    participant Global as npm Global Link
    
    User->>Shared: make mfe1-shared (builds mfe-shared)
    Shared->>Global: npm link (registers globally)
    Global->>Shell: mfe-shared available
    Global->>MFE1: mfe-shared available
    
    Shell->>MFE1: Both use SAME instance in memory
    MFE1-->>Shell: Shared state synchronized
    
    note over Shell,MFE1: Single Singleton Pattern<br/>No duplication
```

**Benefits:**
- **Singleton:** Both Shell and MFE1 use exact same in-memory instance
- **Consistency:** Shared state stays in sync across applications
- **Development:** Changes to shared lib reflect immediately (no rebuild)
- **Type Safety:** Shared TypeScript interfaces across boundaries

**Setup:**
```bash
# First time setup
npm link

# Development workflow
make mfe1-shared    # Build shared library
npm start           # Start Shell (links to shared)
```

---

## Deployment Architecture

### Docker Deployment

```mermaid
graph TB
    subgraph "Development Ports"
        ShellDev["Shell Dev<br/>localhost:4200"]
        MFE1Dev["MFE1 Dev<br/>localhost:3000"]
        MFE2Dev["MFE2 Dev<br/>localhost:3002"]
    end
    
    subgraph "Docker Containers"
        ShellImg["Shell Container<br/>image: shell:latest<br/>port: 8080 → 4200"]
        MFE1Img["MFE1 Container<br/>image: mfe1:latest<br/>port: 8080 → 3000"]
        MFE2Img["MFE2 Container<br/>image: mfe2:latest<br/>port: 8080 → 3002"]
    end
    
    subgraph "Production Ports"
        ShellProd["Port 4200"]
        MFE1Prod["Port 3000"]
        MFE2Prod["Port 3002"]
    end
    
    subgraph "Internal"
        ShellInt["8080"]
        MFE1Int["8080"]
        MFE2Int["8080"]
    end
    
    ShellDev -.->|same as| ShellImg
    MFE1Dev -.->|same as| MFE1Img
    MFE2Dev -.->|same as| MFE2Img
    
    ShellImg --> ShellInt
    MFE1Img --> MFE1Int
    MFE2Img --> MFE2Int
    
    ShellInt -.->|maps to| ShellProd
    MFE1Int -.->|maps to| MFE1Prod
    MFE2Int -.->|maps to| MFE2Prod
    
    style ShellDev fill:#4A90E2
    style MFE1Dev fill:#8E44AD
    style MFE2Dev fill:#E91E63
```

**Port Mapping:**
| Component | External | Internal | Purpose |
|-----------|----------|----------|---------|
| Shell | 4200 | 8080 | Host application |
| MFE1 | 3000 | 8080 | Angular remote |
| MFE2 | 3002 | 8080 | React remote |

**Container Orchestration:**
- Each container can run independently
- Or run together via docker-compose (future feature)
- Health checks validate container readiness
- Environment-aware configuration (dev/prod)

---

## Data Flow

### User Request to Remote Component Load

```mermaid
sequenceDiagram
    participant Browser as Browser
    participant Shell as Shell Host
    participant Config as shell-config.json
    participant Remote as MFE Remote
    participant SharedLib as mfe-shared
    
    Browser->>Shell: Navigate to /mfe1/dashboard
    Shell->>Shell: Parse route: mfe1/dashboard
    Shell->>Config: Get MFE1 config
    Config-->>Shell: Return remoteEntry URL
    Shell->>Remote: Fetch remoteEntry.json
    Remote-->>Shell: Return module metadata
    Shell->>Remote: Load remote module
    Remote-->>Shell: Module loaded
    Shell->>SharedLib: Inject dependencies
    SharedLib-->>Remote: Services injected
    Remote-->>Shell: Render component
    Shell->>Browser: Display component
```

### State Synchronization (Shell ↔ MFE1)

```mermaid
sequenceDiagram
    participant UI1 as Shell UI
    participant Service1 as Shell Service
    participant Shared as SharedContextService
    participant Service2 as MFE1 Service
    participant UI2 as MFE1 UI
    
    UI1->>Service1: updateUserContext(data)
    Service1->>Shared: Update state in singleton
    Shared-->>Service1: Confirm
    Shared-->>Service2: Emit state changed event
    Service2->>UI2: Update binding
    UI2->>Browser: Re-render
```

**Key Pattern:**
- Services inject SharedContextService
- All state changes go through shared service
- Services subscribe to state changes
- UI updates automatically when state changes

---

## Technology Stack

### Frontend Stack

```mermaid
graph TB
    subgraph "Shell"
        ShellFrame["Angular 21.1"]
        ShellBuild["Angular CLI + Vite"]
        ShellTest["Vitest"]
    end
    
    subgraph "MFE1"
        MFE1Frame["Angular 21.1"]
        MFE1Build["Angular CLI + Vite"]
        MFE1Test["Karma + Jasmine"]
    end
    
    subgraph "MFE2"
        MFE2Frame["React 18"]
        MFE2Build["Custom build.js"]
        MFE2Test["None (Gap)"]
    end
    
    subgraph "Federation"
        Federation["@angular-architects<br/>native-federation"]
    end
    
    subgraph "Shared"
        SharedLib["mfe-shared (Angular)"]
        SharedState["SharedContextService"]
    end
    
    ShellFrame --> Federation
    MFE1Frame --> Federation
    MFE2Frame --> Federation
    
    ShellFrame --> SharedLib
    MFE1Frame --> SharedLib
    
    SharedLib --> SharedState
    
    style ShellFrame fill:#4A90E2
    style MFE1Frame fill:#8E44AD
    style MFE2Frame fill:#E91E63
    style Federation fill:#F39C12
    style SharedLib fill:#FF9800
```

### Infrastructure Stack

```mermaid
graph TB
    subgraph "Source Control"
        Git["Git"]
        GitHub["GitHub Repo"]
    end
    
    subgraph "CI/CD"
        Actions["GitHub Actions"]
        Tests["Automated Tests"]
        Build["Build Pipeline"]
    end
    
    subgraph "Containerization"
        Docker["Docker"]
        Images["Container Images"]
    end
    
    subgraph "Deployment"
        Kubernetes["Kubernetes<br/>(optional)"]
        Nginx["Nginx Reverse Proxy"]
    end
    
    Git --> GitHub
    GitHub --> Actions
    Actions --> Tests
    Tests --> Build
    Build --> Docker
    Docker --> Images
    Images --> Nginx
    Nginx --> Kubernetes
    
    style Git fill:#F1502F
    style Actions fill:#2088F0
    style Docker fill:#2496ED
    style Nginx fill:#009639
```

---

## Architecture Decisions

### 1. Native Federation (not Webpack Module Federation)
**Decision:** Use @angular-architects/native-federation  
**Rationale:** Standards-compliant, not Webpack-dependent, supports mixed frameworks  
**Trade-off:** ES module syntax, requires modern browser support

### 2. Singleton Shared Library via npm link
**Decision:** Use npm link for mfe-shared singleton pattern  
**Rationale:** Single in-memory instance, simple development workflow  
**Trade-off:** Requires prerequisite setup, manual linking

### 3. Configuration-Driven MFE Discovery
**Decision:** Runtime configuration in shell-config.json  
**Rationale:** Add MFEs without code changes, flexible routing  
**Trade-off:** JSON configuration instead of code-based setup

### 4. Generic Wrapper Component for React
**Decision:** GenericMfeWrapperComponent handles React integration  
**Rationale:** Allows non-Angular frameworks, maintains architecture simplicity  
**Trade-off:** Extra wrapper layer, requires framework-agnostic design

### 5. Independent Testing Strategies
**Decision:** Shell uses Vitest, MFE1 uses Karma/Jasmine, MFE2 needs tests  
**Rationale:** Flexibility per team, tech choice per container  
**Trade-off:** Different test runners to maintain, consistency gaps

---

## Related Requirements

For detailed specifications on each component:

- **[REQ-A001: Native Federation Architecture](requirements/architecture/REQ-A001.md)** - Module federation setup
- **[REQ-A002: Shared Library Singleton Pattern](requirements/architecture/REQ-A002.md)** - State sharing
- **[REQ-A003: Shell Dynamic Routing System](requirements/architecture/REQ-A003.md)** - Runtime routing
- **[REQ-A004: Docker Deployment & Containerization](requirements/architecture/REQ-A004.md)** - Container setup

---

## Deployment Checklist

### Prerequisites
- [ ] Docker installed and running
- [ ] Node.js 18+ and npm 11+
- [ ] mfe-shared built: `make mfe1-shared`
- [ ] npm link configured for shared library

### Development Startup
```bash
# Terminal 1: Start Shell (includes shared)
cd mfe-shell-container
npm start

# Terminal 2: Start MFE1
cd mfe1-container
npm start

# Terminal 3: Start MFE2
cd mfe2-container
npm start
```

### Docker Deployment
```bash
# Build all containers
docker-compose build

# Run all services
docker-compose up

# Access Shell at http://localhost:4200
```

---

## Scaling Considerations

### Adding a New MFE
1. Create new Angular or React application
2. Configure native federation for that app
3. Build and deploy to accessible URL
4. Add entry to shell-config.json with:
   - MFE name
   - remoteEntry.json URL
   - Routes to expose
   - Menu items
5. Shell automatically discovers and loads at runtime

**No code changes needed in Shell application!**

### High Availability
- Each container can scale independently
- Load balance Shell across multiple instances
- Load balance each MFE across multiple instances
- Centralized configuration service for shell-config.json

---

## Known Gaps & Improvements

1. **Testing:** MFE2 (React) needs E2E testing framework
2. **Documentation:** Several README and technical docs need updates
3. **Docker Compose:** Full-stack docker-compose.yml would simplify development
4. **E2E Tests:** End-to-end testing framework not implemented

See [DOCUMENTATION_ANALYSIS.md](DOCUMENTATION_ANALYSIS.md) for detailed issue tracking.

