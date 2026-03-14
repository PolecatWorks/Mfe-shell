# MFE1 Container (Angular Micro Frontend)

⚠️ **This is a Micro Frontend (MFE) that integrates with the Shell host application.**

For full architecture details, federation setup, and shared library documentation, see the main [README.md](../README.md).

---

## About This MFE

MFE1 is a remote micro frontend built with Angular 21 that exposes routes via Native Federation. It can run:
- **Standalone** at http://localhost:3000 (using `make mfe1-dev`)
- **Integrated** within the Shell (http://localhost:4200)

This MFE uses the singleton `mfe-shared` library to access shared state with the Shell.

---

**Angular Project Info:** Generated with Angular CLI version 21.2.1

## Development server

### Standalone Mode
To run MFE1 as a standalone application:

```bash
ng serve
# or via Makefile
make mfe1-dev
```

Once the server is running, open your browser and navigate to `http://localhost:3000/`. The application will automatically reload whenever you modify any of the source files.

**Note:** Before running standalone, ensure the shared library is linked:
```bash
make mfe1-shared
```

### Integrated Mode
To see MFE1 running within the Shell, follow the instructions in the main [README.md](../README.md#quick-start).

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

This MFE uses [Karma](https://karma-runner.github.io) with [Jasmine](https://jasmine.github.io/) for unit testing.

To execute unit tests, use the following command:

```bash
ng test
```

**Note:** The Shell (`mfe-shell-container`) uses Vitest instead of Karma. Each MFE may have different test runners. See the main [README.md](../README.md) for testing setup across all MFEs.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
