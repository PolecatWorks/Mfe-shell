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
  if (props && props.content) {
    const data = props.content;
    if (data.first_name) componentRef.setInput('firstName', data.first_name);
    if (data.last_name) componentRef.setInput('lastName', data.last_name);
    if (data.email) componentRef.setInput('email', data.email);
    if (data.phone_number) componentRef.setInput('phoneNumber', data.phone_number);
    if (data.address) componentRef.setInput('address', data.address);
    if (data.actions) componentRef.setInput('actions', data.actions);
  } else if (props) {
    if (props.firstName) componentRef.setInput('firstName', props.firstName);
    if (props.lastName) componentRef.setInput('lastName', props.lastName);
    if (props.email) componentRef.setInput('email', props.email);
    if (props.phoneNumber) componentRef.setInput('phoneNumber', props.phoneNumber);
    if (props.address) componentRef.setInput('address', props.address);
    if (props.actions) componentRef.setInput('actions', props.actions);
  }

  if (props && props.onAction) {
    componentRef.instance.actionEvent.subscribe((payload: any) => {
      props.onAction('submit', payload);
    });
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
