import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';

let root: Root | null = null;

export function mount(container: HTMLElement, props: any) {
  if (root) {
    console.warn('React root already exists, unmounting first');
    root.unmount();
  }

  root = createRoot(container);
  root.render(React.createElement(App, {
    userContext: props.userContext,
    setContext: props.setContext
  }));

  return () => {
    if (root) {
      root.unmount();
      root = null;
    }
  };
}

export function unmount(container: HTMLElement) {
  if (root) {
    root.unmount();
    root = null;
  }
}
