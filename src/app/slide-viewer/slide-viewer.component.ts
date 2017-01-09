import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core'
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
    private el: ElementRef,
    private sanitizer: DomSanitizer,
  ) {
    super()
  }


  ngOnInit() {
    this.initGetState()
    this.setIFrameElement()
  }


  private initGetState(): void {
    this.disposable = this.store.getState()
      .filterByUpdatedKey(KEY.slideViwerConfig)
      .subscribe(state => {
        const url = state.slideViwerConfig.url
        let fixedUrl: string = ''
        if (url.includes('docs.google.com')) {
          fixedUrl = url + '/embed?start=false&loop=false&delayms=3000'
        } else {
          fixedUrl = url
        }
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fixedUrl)
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


  setIFrameElement(): Promise<any> {
    const element = this.el.nativeElement as HTMLElement
    const iframe = element.querySelector('iframe')
    return this.store.setState(KEY.slideViwerConfig, (p) => ({ url: p.url, element: iframe }))
  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }

}
