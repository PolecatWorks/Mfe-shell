import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { SharedContextService, SharedOtelService } from '@polecatworks/mfe-shared';
import { MFE_CONFIG, MfeConfig, parseOidcClaims } from './mfe-config';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'mfe-shell-container';

  constructor(
    private sharedContext: SharedContextService,
    private oauthService: OAuthService,
    private otelService: SharedOtelService,
    @Inject(MFE_CONFIG) private mfeConfig: MfeConfig
  ) {}

  ngOnInit(): void {
    if (this.mfeConfig.otel) {
      this.otelService.initialize(this.mfeConfig.otel);
    }

    // Always trigger OIDC login flow via Keycloak discovery document (zero mock/dev-only bypass)
    this.oauthService.loadDiscoveryDocumentAndLogin().catch(err => {
      console.error('Failed to load Keycloak discovery document or execute login', err);
    });

    // Setup automatic silent refresh when configured
    this.oauthService.setupAutomaticSilentRefresh();

    // Listen to token lifecycle events (token_received, token_refreshed)
    this.oauthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'token_received' || e.type === 'token_refreshed'))
      .subscribe(() => {
        this.updateUserContext();
      });

    // Check existing valid token on boot
    if (this.oauthService.hasValidAccessToken()) {
      this.updateUserContext();
    }
  }

  private updateUserContext(): void {
    const context = parseOidcClaims(
      this.oauthService.getIdentityClaims(),
      this.oauthService.getAccessToken()
    );
    this.sharedContext.setContext(context);
  }
}
