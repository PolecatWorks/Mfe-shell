import { initFederation } from '@angular-architects/native-federation';
import { parseShellConfig } from './app/config-parser';

const FATAL_ERROR_ELEMENT_ID = 'mfe-shell-fatal-error';

function renderFatalError(title: string, summary: string, error: unknown): void {
  if (document.getElementById(FATAL_ERROR_ELEMENT_ID)) {
    return;
  }

  const detail = error instanceof Error ? error.message : String(error || 'Unknown error');

  const container = document.createElement('div');
  container.id = FATAL_ERROR_ELEMENT_ID;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    color: #ff4444;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    flex-direction: column;
    font-family: sans-serif;
    text-align: center;
    padding: 24px;
    box-sizing: border-box;
  `;

  const heading = document.createElement('h1');
  heading.style.marginBottom = '20px';
  heading.textContent = title;

  const summaryEl = document.createElement('p');
  summaryEl.style.cssText = 'font-size: 1.2rem; margin-bottom: 16px; color: #ccc;';
  summaryEl.textContent = summary;

  const detailEl = document.createElement('p');
  detailEl.style.cssText = 'font-size: 0.9rem; color: #888; margin-bottom: 30px; max-width: 720px; word-break: break-word;';
  detailEl.textContent = detail;

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.textContent = 'Retry';
  retryBtn.style.cssText = `
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 4px;
  `;
  retryBtn.addEventListener('click', () => window.location.reload());

  container.append(heading, summaryEl, detailEl, retryBtn);
  document.body.appendChild(container);
}

async function startShell(): Promise<void> {
  const res = await fetch('/assets/contents/shell-config.json');
  if (!res.ok) {
    throw new Error(`Failed to fetch /assets/contents/shell-config.json: HTTP ${res.status} ${res.statusText}`);
  }

  const rawConfig: unknown = await res.json();
  const config = parseShellConfig(rawConfig);

  await initFederation(config.remotes);

  const bootstrapModule = await import('./bootstrap');
  await bootstrapModule.default(config);
}

startShell().catch((err: unknown) => {
  console.error('Fatal shell bootstrap error:', err);
  renderFatalError(
    'Configuration Error',
    'Failed to load shell configuration or initialize application.',
    err
  );
});
