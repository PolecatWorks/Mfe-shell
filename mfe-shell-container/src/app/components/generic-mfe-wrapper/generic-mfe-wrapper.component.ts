import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { SharedContextService } from '@polecatworks/mfe-shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generic-mfe-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: '<div #mfeContainer></div>'
})
export class GenericMfeWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('mfeContainer', { static: true }) container!: ElementRef;
  private sharedContext = inject(SharedContextService);
  private route = inject(ActivatedRoute);
  private unmount: (() => void) | undefined;

  async ngOnInit() {
    // Get route data from snapshot. Note: if path parameters change but component is reused, ngOnInit might not rerun.
    // However, MFE path usually changes completely (/mfe1 -> /mfe2) so new component instance.
    const data = this.route.snapshot.data;
    const remoteName = data['remoteName'];
    const exposedModule = data['exposedModule'];

    if (!remoteName || !exposedModule) {
      console.error('GenericMfeWrapperComponent: Missing remoteName or exposedModule in route data.');
      return;
    }

    try {
      const userContext = this.sharedContext.getContext();
      const m = await loadRemoteModule(remoteName, exposedModule);
      if (m.mount) {
          this.unmount = m.mount(this.container.nativeElement, { userContext });
      } else {
          console.error(`Remote module ${remoteName}/${exposedModule} does not export mount function.`);
          if (this.container && this.container.nativeElement) {
            this.container.nativeElement.innerText = `Module ${remoteName} does not export mount function.`;
          }
      }
    } catch (err) {
      console.error(`Error loading MFE ${remoteName}:`, err);
      if (this.container && this.container.nativeElement) {
        this.container.nativeElement.innerText = `Failed to load ${remoteName}.`;
      }
    }
  }

  ngOnDestroy() {
    if (this.unmount) {
      this.unmount();
    }
  }
}
