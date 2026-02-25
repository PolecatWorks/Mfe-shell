import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { SharedContextService } from 'mfe-shared';

@Component({
  selector: 'app-mfe2-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: '<div #mfe2Container></div>'
})
export class Mfe2WrapperComponent implements OnInit, OnDestroy {
  @ViewChild('mfe2Container', { static: true }) container!: ElementRef;
  private sharedContext = inject(SharedContextService);
  private unmount: (() => void) | undefined;

  async ngOnInit() {
    try {
      const userContext = this.sharedContext.getContext();
      const m = await loadRemoteModule('mfe2', './Component');
      this.unmount = m.mount(this.container.nativeElement, { userContext });
    } catch (err) {
      console.error('Error loading MFE2:', err);
      if (this.container && this.container.nativeElement) {
        this.container.nativeElement.innerText = 'Failed to load Irish MFE.';
      }
    }
  }

  ngOnDestroy() {
    if (this.unmount) {
      this.unmount();
    }
  }
}
