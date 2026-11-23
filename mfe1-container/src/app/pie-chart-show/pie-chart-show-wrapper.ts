import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { applyJsonPatches, JsonPatchOp, MfeMountProps } from '@polecatworks/mfe-shared';
import { PieChartShow } from './pie-chart-show';

export interface PieChartShowState {
  title: string;
  content: unknown[];
}

const appRefs = new Map<HTMLElement, ApplicationRef>();
const componentRefs = new Map<HTMLElement, ComponentRef<PieChartShow>>();

export async function mount(container: HTMLElement, props?: MfeMountProps<unknown[]>) {
  if (appRefs.has(container)) {
    console.warn('Angular app already mounted on this container, unmounting first.');
    unmount(container);
  }

  const appRef = await createApplication();
  const environmentInjector = appRef.injector.get(EnvironmentInjector);
  const componentRef = createComponent(PieChartShow, {
    environmentInjector,
    hostElement: container,
  });

  let currentState: PieChartShowState = {
    title: props?.title ?? '',
    content: props?.content ?? [],
  };
  if (props) {
    if (props.title) componentRef.setInput('title', props.title);
    if (props.content) componentRef.setInput('content', props.content);
  }

  appRef.attachView(componentRef.hostView);
  componentRef.changeDetectorRef.detectChanges();

  appRefs.set(container, appRef);
  componentRefs.set(container, componentRef);

  const cleanup = () => unmount(container);
  return Object.assign(cleanup, {
    applyPatch: (patches: JsonPatchOp[] | Partial<PieChartShowState>) => {
      currentState = applyJsonPatches(currentState, patches);
      if (currentState.title) componentRef.setInput('title', currentState.title);
      if (currentState.content) componentRef.setInput('content', currentState.content);
      componentRef.changeDetectorRef.detectChanges();
    },
    getState: () => currentState,
    getSchema: () => ({
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'PieChartShow',
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'array' }
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
