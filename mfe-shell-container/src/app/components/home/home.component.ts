import { Component, Inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MFE_CONFIG } from '../../mfe-config.token';
import { MfeConfig } from '../../mfe-config.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, RouterOutlet, RouterLink],
})
export class HomeComponent {
  constructor(@Inject(MFE_CONFIG) public config: MfeConfig) {}
}
