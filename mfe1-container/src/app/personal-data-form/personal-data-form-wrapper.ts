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

  if (props && props.id) {
    componentRef.setInput('canvasId', props.id);
  }

  // Set the inputs from props
  const data = props && (props.content || props.initialState) ? (props.content || props.initialState) : props;
  if (data && typeof data === 'object') {
    if (data.first_name ?? data.firstName) componentRef.setInput('firstName', data.first_name ?? data.firstName);
    if (data.last_name ?? data.lastName) componentRef.setInput('lastName', data.last_name ?? data.lastName);
    if (data.email) componentRef.setInput('email', data.email);
    if (data.phone_number ?? data.phoneNumber) componentRef.setInput('phoneNumber', data.phone_number ?? data.phoneNumber);
    if (data.address) componentRef.setInput('address', data.address);
    if (data.actions) componentRef.setInput('actions', data.actions);
  }

  if (props && props.onAction) {
    componentRef.instance.actionEvent.subscribe((payload: any) => {
      props.onAction('submit', payload);
    });
  }

  if (props && props.onStateChange) {
    componentRef.instance.stateChange.subscribe((evt: { state: any; patches: any[] }) => {
      props.onStateChange(evt.state, evt.patches);
    });
  }

  if (props && props.onSelectionChange) {
    componentRef.instance.selectionChange.subscribe((selection: any) => {
      props.onSelectionChange(selection);
    });
  }

  // Attach the component view to the ApplicationRef
  appRef.attachView(componentRef.hostView);

  // Trigger immediate change detection
  componentRef.changeDetectorRef.detectChanges();

  // Store references for cleanup
  appRefs.set(container, appRef);
  componentRefs.set(container, componentRef);

  const cleanup = () => unmount(container);
  return Object.assign(cleanup, {
    applyPatch: (patches: any, attributions?: any[]) => {
      componentRef.instance.applyPatch(patches, attributions || []);
      componentRef.changeDetectorRef.detectChanges();
    },
    getState: () => componentRef.instance.getState(),
    getSchema: () => componentRef.instance.getSchema(),
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
