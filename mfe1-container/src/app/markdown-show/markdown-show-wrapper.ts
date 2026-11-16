import { ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { MarkdownShow } from './markdown-show';

const appRefs = new Map<HTMLElement, ApplicationRef>();
const componentRefs = new Map<HTMLElement, any>();

export async function mount(container: HTMLElement, props: any) {
  if (appRefs.has(container)) {
    console.warn('Angular app already mounted on this container, unmounting first.');
    unmount(container);
  }

  const appRef = await createApplication();
  const environmentInjector = appRef.injector.get(EnvironmentInjector);
  const componentRef = createComponent(MarkdownShow, {
    environmentInjector,
    hostElement: container,
  });

  let currentState: any = props;
  if (props) {
    componentRef.setInput('content', props);
  }

  appRef.attachView(componentRef.hostView);
  componentRef.changeDetectorRef.detectChanges();

  appRefs.set(container, appRef);
  componentRefs.set(container, componentRef);

  const cleanup = () => unmount(container);
  return Object.assign(cleanup, {
    applyPatch: (patches: any) => {
      if (Array.isArray(patches)) {
        const nextState = typeof currentState === 'object' && currentState !== null
          ? { ...currentState }
          : { content: currentState };
        for (const p of patches) {
          const key = p.path?.replace(/^\//, '');
          if (key && (p.op === 'replace' || p.op === 'add')) {
            nextState[key] = p.value;
          }
        }
        currentState = nextState;
      } else {
        currentState = typeof patches === 'object' && patches !== null ? { ...currentState, ...patches } : { content: patches };
      }
      componentRef.setInput('content', currentState);
      componentRef.changeDetectorRef.detectChanges();
    },
    getState: () => currentState,
    getSchema: () => ({
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'MarkdownShow',
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Markdown string' }
      }
    }),
    unmount: cleanup,
  });
}

export function unmount(container: HTMLElement) {
  const componentRef = componentRefs.get(container);
  if (componentRef) {
    componentRef.destroy();
    componentRefs.delete(container);
  }

  const appRef = appRefs.get(container);
  if (appRef) {
    appRef.destroy();
    appRefs.delete(container);
  }
}
