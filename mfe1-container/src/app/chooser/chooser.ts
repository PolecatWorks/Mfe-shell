import { Component, inject } from '@angular/core';
import { SharedContextService, UserContext } from '@polecatworks/mfe-shared';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chooser',
  imports: [MatButtonModule],
  template: `
    <div style="border: 2px dashed green; padding: 10px; margin-top: 10px;">
      <h2>Scottish Mythology Character Chooser</h2>
      <div style="display: flex; gap: 10px;">
        @for (char of characters; track char.name) {
          <button mat-raised-button color="accent" (click)="selectCharacter(char)">
            {{ char.name }}
          </button>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class Chooser {
  public sharedContext: SharedContextService = inject(SharedContextService);

  characters: UserContext[] = [
    { name: 'Kelpie', username: 'waterhorse', roles: ['trickster', 'myth'] },
    { name: 'Selkie', username: 'sealfolk', roles: ['shapeshifter', 'myth'] },
    { name: 'Beira', username: 'winterqueen', roles: ['goddess', 'creator'] }
  ];

  selectCharacter(character: UserContext) {
    this.sharedContext.setContext(character);
  }
}
