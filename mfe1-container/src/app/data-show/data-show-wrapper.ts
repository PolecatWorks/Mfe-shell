import { ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { DataShow } from './data-show';

const appRefs = new Map<HTMLElement, ApplicationRef>();
const componentRefs = new Map<HTMLElement, any>();

export async function mount(container: HTMLElement, props: any) {
  if (appRefs.has(container)) {
    console.warn('Angular app already mounted on this container, unmounting first.');
    unmount(container);
  }

  const appRef = await createApplication();
  const environmentInjector = appRef.injector.get(EnvironmentInjector);
  const componentRef = createComponent(DataShow, {
    environmentInjector,
    hostElement: container,
  });

  let currentState: any = props?.content ?? props ?? {};

  const applyProps = (inputProps: any) => {
    const data = inputProps && inputProps.content !== undefined ? inputProps.content : inputProps;
    currentState = data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.title) componentRef.setInput('title', data.title);
      if (data.datasets) componentRef.setInput('content', data.datasets);
      if (data.x_axis_type ?? data.xType) componentRef.setInput('xType', data.x_axis_type ?? data.xType);
    } else if (inputProps) {
      if (inputProps.title) componentRef.setInput('title', inputProps.title);
      if (inputProps.content) componentRef.setInput('content', inputProps.content);
      if (inputProps.xType) componentRef.setInput('xType', inputProps.xType);
    }
    componentRef.changeDetectorRef.detectChanges();
  };

  appRef.attachView(componentRef.hostView);
  applyProps(props);

  appRefs.set(container, appRef);
  componentRefs.set(container, componentRef);

  const cleanup = () => unmount(container);
  return Object.assign(cleanup, {
    applyPatch: (patches: any) => {
      if (Array.isArray(patches)) {
        const nextState = JSON.parse(JSON.stringify(currentState || {}));
        for (const p of patches) {
          const key = p.path?.replace(/^\//, '');
          if (key && (p.op === 'replace' || p.op === 'add')) {
            nextState[key] = p.value;
          }
        }
        applyProps({ content: nextState });
      } else {
        applyProps(patches);
      }
    },
    getState: () => currentState,
    getSchema: () => ({
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'DataShow',
      type: 'object',
      properties: {
        title: { type: 'string' },
        x_axis_type: { type: 'string' },
        datasets: { type: 'array' }
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
