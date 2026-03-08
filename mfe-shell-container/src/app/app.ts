import { Component, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { SharedContextService } from 'mfe-shared';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'mfe-shell-container';

  constructor(private sharedContext: SharedContextService, private oauthService: OAuthService) {
    console.log('App: SharedContextService injected');

    if (!isDevMode()) {
      this.oauthService.loadDiscoveryDocumentAndLogin().catch(err => {
        console.error('Failed to load discovery document or login', err);
      });
    } else {
      console.log('App: DevMode bypass login redirect');
    }

    this.oauthService.events.pipe(filter(e => e.type === 'token_received')).subscribe(_ => {
      this.oauthService.loadUserProfile();

      const claims = this.oauthService.getIdentityClaims() as any;
      const accessToken = this.oauthService.getAccessToken();

      this.sharedContext.setContext({
        username: claims?.preferred_username || claims?.email || 'ShellUser',
        name: claims?.name || 'Shellos',
        roles: claims?.roles || ['admin'],
        accessToken: accessToken
      });
    });

    if (!this.oauthService.hasValidAccessToken()) {
      this.sharedContext.setContext({ username: 'ShellUser', name: 'Shellos', roles: ['admin'] });
    } else {
      const claims = this.oauthService.getIdentityClaims() as any;
      const accessToken = this.oauthService.getAccessToken();
      this.sharedContext.setContext({
        username: claims?.preferred_username || claims?.email || 'ShellUser',
        name: claims?.name || 'Shellos',
        roles: claims?.roles || ['admin'],
        accessToken: accessToken
      });
    }
  }
}
