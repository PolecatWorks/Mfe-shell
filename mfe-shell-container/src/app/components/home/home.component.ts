import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MFE_CONFIG, MenuConfig } from '../../mfe-config';
import { fadeAnimation } from '../../route-animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatButtonModule, MatMenuModule, MatIconModule, MatTooltipModule, RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  animations: [fadeAnimation]
})
export class HomeComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  readonly config = inject(MFE_CONFIG);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  menuItems: MenuConfig[] = [];

  ngOnInit() {
    if (this.config && this.config.menu) {
      this.menuItems = this.config.menu;
    }
  }

  reload() {
    window.location.reload();
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    if (outlet && outlet.isActivated) {
      // Use the route path to uniquely identify the state for the animation trigger
      return outlet.activatedRoute.routeConfig?.path || 'default';
    }
    return 'none';
  }
}
