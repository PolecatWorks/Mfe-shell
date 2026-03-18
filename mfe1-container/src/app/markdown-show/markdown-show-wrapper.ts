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

  // Create an Angular application instance
  const appRef = await createApplication();

  // Create the component instance and attach it to the provided DOM element
  const environmentInjector = appRef.injector.get(EnvironmentInjector);
  const componentRef = createComponent(MarkdownShow, {
    environmentInjector,
    hostElement: container,
  });

  // Set the inputs
  if (props) {
    componentRef.setInput('content', props);
  }

  // Attach the component view to the ApplicationRef
  appRef.attachView(componentRef.hostView);

  // Trigger immediate change detection for this component
  componentRef.changeDetectorRef.detectChanges();

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
