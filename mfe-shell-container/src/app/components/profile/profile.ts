import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SharedContextService } from 'mfe-shared';

@Component({
  selector: 'app-profile',
  imports: [MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  constructor(
    public context: SharedContextService
  ) { }

}
