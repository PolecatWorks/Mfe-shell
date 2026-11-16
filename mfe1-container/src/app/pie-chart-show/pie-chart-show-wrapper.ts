import { ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { PieChartShow } from './pie-chart-show';

const appRefs = new Map<HTMLElement, ApplicationRef>();
const componentRefs = new Map<HTMLElement, any>();

export async function mount(container: HTMLElement, props: any) {
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

  let currentState: any = { title: props?.title ?? '', content: props?.content ?? [] };
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
    applyPatch: (patches: any) => {
      if (Array.isArray(patches)) {
        for (const p of patches) {
          const key = p.path?.replace(/^\//, '');
          if (key && (p.op === 'replace' || p.op === 'add')) {
            currentState[key] = p.value;
          }
        }
      } else if (patches && typeof patches === 'object') {
        if (patches.title !== undefined) currentState.title = patches.title;
        if (patches.content !== undefined) currentState.content = patches.content;
      }
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
