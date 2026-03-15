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

  // Create an Angular application instance
  const appRef = await createApplication();

  // Create the component instance and attach it to the provided DOM element
  const environmentInjector = appRef.injector.get(EnvironmentInjector);
  const componentRef = createComponent(DataShow, {
    environmentInjector,
    hostElement: container,
  });

  // Set the inputs
  const data = props?.data || props;
  if (data) {
    if (data.title) componentRef.setInput('title', data.title);
    if (data.datasets) componentRef.setInput('datasets', data.datasets);
    if (data.xType) componentRef.setInput('xType', data.xType);
  }

  // Attach the component view to the ApplicationRef
  appRef.attachView(componentRef.hostView);

  // Store references for cleanup
  appRefs.set(container, appRef);
  componentRefs.set(container, componentRef);

  return () => unmount(container);
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
