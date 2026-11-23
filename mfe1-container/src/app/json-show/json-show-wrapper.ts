import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { applyJsonPatches, JsonPatchOp, MfeMountProps } from '@polecatworks/mfe-shared';
import { JsonShow } from './json-show';

const appRefs = new Map<HTMLElement, ApplicationRef>();
const componentRefs = new Map<HTMLElement, ComponentRef<JsonShow>>();

export async function mount(container: HTMLElement, props?: MfeMountProps<Record<string, unknown>> | Record<string, unknown>) {
  if (appRefs.has(container)) {
    console.warn('Angular app already mounted on this container, unmounting first.');
    unmount(container);
  }

  const appRef = await createApplication();
  const environmentInjector = appRef.injector.get(EnvironmentInjector);
  const componentRef = createComponent(JsonShow, {
    environmentInjector,
    hostElement: container,
  });

  const mountProps = props as MfeMountProps<Record<string, unknown>> | undefined;
  let currentState: Record<string, unknown> =
    (mountProps?.content !== undefined ? mountProps.content : (props as Record<string, unknown>)) ?? {};
  if (mountProps && mountProps.content !== undefined) {
    componentRef.setInput('content', mountProps.content);
  }

  appRef.attachView(componentRef.hostView);
  componentRef.changeDetectorRef.detectChanges();

  appRefs.set(container, appRef);
  componentRefs.set(container, componentRef);

  const cleanup = () => unmount(container);
  return Object.assign(cleanup, {
    applyPatch: (patches: JsonPatchOp[] | Record<string, unknown>) => {
      if (Array.isArray(patches)) {
        const baseState =
          typeof currentState === 'object' && currentState !== null ? currentState : {};
        currentState = applyJsonPatches(baseState, patches);
      } else {
        const recordPatch = patches as Record<string, unknown> | undefined;
        currentState = (recordPatch?.['content'] !== undefined
          ? recordPatch['content']
          : recordPatch) as Record<string, unknown>;
      }
      componentRef.setInput('content', currentState);
      componentRef.changeDetectorRef.detectChanges();
    },
    getState: () => currentState,
    getSchema: () => ({
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'JsonShow',
      type: 'object',
      additionalProperties: true
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
