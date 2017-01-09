import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Observable } from 'rxjs'

import { Disposer } from '../../lib/class'
import { SimpleStore } from '../../lib/simple-store'
import { AppState, KEY } from '../../state'
import { slideViewerId } from '../../config';


@Component({
  selector: 'app-slide-viewer',
  template: `
    <iframe [id]="slideViewerId"
      [src]="safeUrl"
      frameborder="0" [width]="screenWidth" [height]="screenHeight" allowfullscreen="true" 
      mozallowfullscreen="true" webkitallowfullscreen="true">
    </iframe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideViewerComponent extends Disposer implements OnInit, OnDestroy {
  screenWidth: number
  screenHeight: number
  safeUrl: SafeResourceUrl
  slideViewerId = slideViewerId


  constructor(
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {
    super()
  }


  ngOnInit() {
    this.initGetState()
  }


  private initGetState(): void {
    this.disposable = this.store.getState()
      .filterByUpdatedKey(KEY.slideUrl)
      .subscribe(state => {
        let url: string = ''
        if (state.slideUrl.includes('docs.google.com')) {
          url = state.slideUrl + '/embed?start=false&loop=false&delayms=3000'
        } else {
          url = state.slideUrl
        }
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
        this.cd.markForCheck()
      })

    this.disposable = this.store.getState()
      .filterByUpdatedKey(KEY.windowState)
      .subscribe(state => {
        this.screenWidth = state.windowState.innerWidth
        this.screenHeight = state.windowState.innerHeight - 50
        this.cd.markForCheck()
      })
  }



  ngOnDestroy() {
    this.disposeSubscriptions()
  }

}
