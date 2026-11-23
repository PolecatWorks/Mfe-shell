import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { applyJsonPatches, JsonPatchOp, MfeMountProps } from '@polecatworks/mfe-shared';
import { MermaidShow } from './mermaid-show';

export interface MermaidShowState {
  title: string;
  content: string;
}

const appRefs = new Map<HTMLElement, ApplicationRef>();
const componentRefs = new Map<HTMLElement, ComponentRef<MermaidShow>>();

export async function mount(container: HTMLElement, props?: MfeMountProps<string>) {
  if (appRefs.has(container)) {
    console.warn('Angular app already mounted on this container, unmounting first.');
    unmount(container);
  }

  const appRef = await createApplication();
  const environmentInjector = appRef.injector.get(EnvironmentInjector);
  const componentRef = createComponent(MermaidShow, {
    environmentInjector,
    hostElement: container,
  });

  let currentState: MermaidShowState = {
    title: props?.title ?? '',
    content: props?.content ?? '',
  };
  if (props && props.content) {
    if (props.title) {
      componentRef.setInput('title', props.title);
    }
    componentRef.setInput('content', props.content);
  }

  appRef.attachView(componentRef.hostView);
  componentRef.changeDetectorRef.detectChanges();

  appRefs.set(container, appRef);
  componentRefs.set(container, componentRef);

  const cleanup = () => unmount(container);
  return Object.assign(cleanup, {
    applyPatch: (patches: JsonPatchOp[] | Partial<MermaidShowState> | string) => {
      if (typeof patches === 'string') {
        currentState = { ...currentState, content: patches };
      } else {
        currentState = applyJsonPatches(currentState, patches);
      }
      if (currentState.title) componentRef.setInput('title', currentState.title);
      if (currentState.content) componentRef.setInput('content', currentState.content);
      componentRef.changeDetectorRef.detectChanges();
    },
    getState: () => currentState,
    getSchema: () => ({
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'MermaidShow',
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string', description: 'Mermaid diagram definition' }
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
