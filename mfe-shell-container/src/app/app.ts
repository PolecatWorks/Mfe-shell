import { Component, isDevMode, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { SharedContextService, SharedOtelService } from '@polecatworks/mfe-shared';
import { MFE_CONFIG, MfeConfig } from './mfe-config';

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

  constructor(
    private sharedContext: SharedContextService,
    private oauthService: OAuthService,
    private otelService: SharedOtelService,
    @Inject(MFE_CONFIG) private mfeConfig: MfeConfig
  ) {
    if (this.mfeConfig.otel) {
      this.otelService.initialize(this.mfeConfig.otel);
    }

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
