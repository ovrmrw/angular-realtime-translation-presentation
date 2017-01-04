import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ElementRef } from '@angular/core'
import { Observable } from 'rxjs'

import { Disposer } from '../../lib/class'
import { SimpleStore, replaceAction } from '../../lib/simple-store'
import { AppState } from '../../state'
import { slideUrlKey } from '../../state'


@Component({
  selector: 'app-slide-url',
  template: `
    <label for="url">SlideUrl:</label>
    <input type="text" [(ngModel)]="url" name="url" class="form-control" id="url">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideUrlComponent extends Disposer implements OnInit, OnDestroy {
  url: string = ''


  constructor(
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
  ) {
    super()
  }


  ngOnInit() {
    this.initObservableEvents()

    const slideUrl = localStorage.getItem('slideUrl')
    if (slideUrl) {
      this.store.setState(slideUrlKey, replaceAction(slideUrl))
        .then(() => {
          this.url = slideUrl
          this.cd.markForCheck()
        })
    }
  }


  private initObservableEvents(): void {
    this.disposable = Observable.fromEvent(this.el.nativeElement, 'keyup')
      .debounceTime(200)
      .subscribe(event => {
        this.store.setState(slideUrlKey, replaceAction(this.url))
          .then(() => {
            localStorage.setItem('slideUrl', this.url)
            // this.cd.markForCheck()            
          })
      })
  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }

}
