import { ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { PersonalDataForm } from './personal-data-form';

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
  const componentRef = createComponent(PersonalDataForm, {
    environmentInjector,
    hostElement: container,
  });

  // Set the inputs from props
  if (props) {
    if (props.firstName) componentRef.setInput('firstName', props.firstName);
    if (props.lastName) componentRef.setInput('lastName', props.lastName);
    if (props.email) componentRef.setInput('email', props.email);
    if (props.phoneNumber) componentRef.setInput('phoneNumber', props.phoneNumber);
    if (props.address) componentRef.setInput('address', props.address);
    if (props.actions) componentRef.setInput('actions', props.actions);

    if (props.onAction) {
      componentRef.instance.actionEvent.subscribe((payload: any) => {
        props.onAction('submit', payload);
      });
    }
  }

  // Attach the component view to the ApplicationRef
  appRef.attachView(componentRef.hostView);

  // Trigger immediate change detection
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
