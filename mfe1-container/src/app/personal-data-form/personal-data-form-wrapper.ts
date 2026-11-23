import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import {
  AiFieldAttribution,
  CanvasSelection,
  JsonPatchOp,
  MfeMountProps,
} from '@polecatworks/mfe-shared';
import { PersonalDataForm } from './personal-data-form';

export interface PersonalDataPayload {
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  email?: string;
  phone_number?: string;
  phoneNumber?: string;
  address?: string;
  actions?: string[];
}

const appRefs = new Map<HTMLElement, ApplicationRef>();
const componentRefs = new Map<HTMLElement, ComponentRef<PersonalDataForm>>();

export async function mount(
  container: HTMLElement,
  props?: MfeMountProps<PersonalDataPayload> & PersonalDataPayload
) {
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
  const data: PersonalDataPayload | undefined =
    props && (props.content || props.initialState) ? (props.content || props.initialState) : props;
  if (data && typeof data === 'object') {
    if (data.first_name ?? data.firstName) componentRef.setInput('firstName', data.first_name ?? data.firstName);
    if (data.last_name ?? data.lastName) componentRef.setInput('lastName', data.last_name ?? data.lastName);
    if (data.email) componentRef.setInput('email', data.email);
    if (data.phone_number ?? data.phoneNumber) componentRef.setInput('phoneNumber', data.phone_number ?? data.phoneNumber);
    if (data.address) componentRef.setInput('address', data.address);
    if (data.actions) componentRef.setInput('actions', data.actions);
  }

  if (props && props.onAction) {
    const onAction = props.onAction;
    componentRef.instance.actionEvent.subscribe((payload: Record<string, unknown>) => {
      onAction('submit', payload);
    });
  }

  if (props && props.onStateChange) {
    const onStateChange = props.onStateChange;
    componentRef.instance.stateChange.subscribe((evt: { state: Record<string, unknown>; patches: JsonPatchOp[] }) => {
      onStateChange(evt.state as PersonalDataPayload, evt.patches);
    });
  }

  if (props && props.onSelectionChange) {
    const onSelectionChange = props.onSelectionChange;
    componentRef.instance.selectionChange.subscribe((selection: CanvasSelection | null) => {
      onSelectionChange(selection);
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
    applyPatch: (patches: JsonPatchOp[] | Record<string, unknown>, attributions?: AiFieldAttribution[]) => {
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
