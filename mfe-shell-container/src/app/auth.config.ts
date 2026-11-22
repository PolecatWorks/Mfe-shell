import { HttpClient } from '@angular/common/http';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { lastValueFrom, tap, catchError, throwError } from 'rxjs';

const FATAL_ERROR_ELEMENT_ID = 'mfe-shell-fatal-error';
const REQUIRED_OIDC_FIELDS = ['issuer', 'clientId', 'redirectUri', 'scope'] as const;

export function validateAuthConfig(raw: unknown): AuthConfig {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('Invalid auth-config.json: payload must be a JSON object');
  }

  const record = raw as Record<string, unknown>;
  const missingFields = REQUIRED_OIDC_FIELDS.filter((field) => {
    const value = record[field];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missingFields.length > 0) {
    throw new Error(
      `Invalid auth-config.json: missing or empty required OIDC field(s): ${missingFields.join(', ')}`
    );
  }

  return { ...(record as AuthConfig) };
}

function renderAuthConfigError(error: unknown): void {
  const existing = document.getElementById(FATAL_ERROR_ELEMENT_ID);
  if (existing) {
    existing.remove();
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';

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
  heading.textContent = 'Configuration Error';

  const summary = document.createElement('p');
  summary.style.cssText = 'font-size: 1.2rem; margin-bottom: 30px; color: #ccc;';
  summary.textContent = 'Failed to load authentication configuration.';

  const details = document.createElement('p');
  details.style.cssText = 'font-size: 0.9rem; color: #888; margin-bottom: 30px; max-width: 720px; word-break: break-word;';
  details.textContent = errorMessage;

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.textContent = 'Retry';
  retryButton.style.cssText = `
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 4px;
  `;
  retryButton.addEventListener('click', () => window.location.reload());

  container.append(heading, summary, details, retryButton);
  document.body.appendChild(container);
}

export function initializeAuthConfig(
  httpClient: HttpClient,
  oauthService: OAuthService
): () => Promise<void> {
  return () => {
    return lastValueFrom(
      httpClient.get<unknown>('/assets/contents/auth-config.json').pipe(
        tap((rawConfig) => {
          const config = validateAuthConfig(rawConfig);
          if (config.redirectUri && !config.redirectUri.startsWith('http')) {
            config.redirectUri = window.location.origin + config.redirectUri;
          }
          oauthService.configure(config);
        }),
        catchError((error: unknown) => {
          console.error('Failed to load or validate auth config', error);
          renderAuthConfigError(error);
          return throwError(() => error);
        })
      )
    ).then(() => {
      return Promise.resolve();
    });
  };
}
