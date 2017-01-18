import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject, ElementRef, AfterViewInit } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Observable } from 'rxjs'

import { Disposer } from '../../lib/class'
import { ReactiveStoreService, KEY } from '../../state'


@Component({
  selector: 'app-slide-viewer',
  template: `
    <iframe
      [src]="safeUrl"
      frameborder="0" [width]="screenWidth" [height]="screenHeight" allowfullscreen="true" 
      mozallowfullscreen="true" webkitallowfullscreen="true">
    </iframe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideViewerComponent extends Disposer implements OnInit, OnDestroy, AfterViewInit {
  screenWidth: number
  screenHeight: number
  safeUrl: SafeResourceUrl
  viewerElement: HTMLIFrameElement


  constructor(
    private store: ReactiveStoreService,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
  ) {
    super()
  }


  ngOnInit() {
    this.viewerElement = this.el.nativeElement.querySelector('iframe')
    this.initGetState()
  }


  private initGetState(): void {
    this.disposable = this.store.getter()
      .filterByUpdatedKey(KEY.slideViwerConfig) // SlideViewer設定が変更されたとき。
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

    this.disposable = this.store.getter()
      .filterByUpdatedKey(KEY.windowState) // Window状態が更新されたとき。
      .subscribe(state => {
        this.screenWidth = state.windowState.innerWidth
        this.screenHeight = state.windowState.innerHeight - 50
        this.cd.markForCheck()
      })

    this.disposable = this.store.getter()
      .filterByUpdatedKey(KEY.signalFocusSlideViewer) // FocusSlideViewerのシグナルが発行されたとき。
      .debounceTime(500)
      .subscribe(state => {
        this.focusViewerElement()
      })
  }


  ngAfterViewInit() {
    this.focusViewerElement()
  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }


  focusViewerElement(): void {
    if (this.viewerElement) {
      this.viewerElement.focus()
    }
  }

}
