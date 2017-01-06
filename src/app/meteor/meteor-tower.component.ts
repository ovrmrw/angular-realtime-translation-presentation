import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs'

import { Disposer } from '../../lib/class'
import { SimpleStore } from '../../lib/simple-store'
import { AppState, KEY } from '../../state'


@Component({
  selector: 'app-meteor-tower',
  template: `
    <app-meteor *ngFor="let m of meteors let i = index" [text]="m.text" [top]="m.top" [color]="m.color" [index]="i + 1">
    </app-meteor>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeteorTowerComponent extends Disposer implements OnInit, OnDestroy {
  meteors: Meteor[] = []
  screenHeight: number


  constructor(
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super()
  }


  ngOnInit() {
    // this.flowTestTexts()
    this.initGetState()
  }


  private flowTestTexts(): void {
    let previousTop = 0

    Observable
      .interval(2000)
      .map(value => 'this is a test ' + value)
      .subscribe(text => {
        // const top = this.getTopPosition(previousTop)
        const top = this.getTopPosition2(previousTop, 60)
        previousTop = top

        const timestamp = new Date().getTime()
        this.meteors.push({ text, top, timestamp, color: 'lightgreen' })
        this.cd.markForCheck()

        /* filtering array */
        this.meteors = this.meteors.filter(meteor => meteor.timestamp > timestamp - 1000 * 20) // 15秒後に削除する。
      })
  }


  private initGetState(): void {
    this.disposable = this.store.getState()
      .filterByUpdatedKey(KEY.windowState)
      .subscribe(state => {
        this.screenHeight = state.windowState.innerHeight
      })


    const initialObj: ScanLoopObject = {
      top: 0,
      transcriptIndex: 0,
      translatedIndex: 0,
    }

    this.disposable = this.store.getState()
      .filterByUpdatedKey(KEY.transcriptList, KEY.translatedList)
      .scan((obj, state) => {
        const timestamp = new Date().getTime()
        const top = this.getTopPosition(obj.top)
        // const top: number = this.getTopPosition2(obj.top, 60)

        if (state.transcriptList.length > obj.transcriptIndex) {
          this.meteors.push({ text: state.transcript, top, timestamp, color: 'white' })
        }
        if (state.translatedList.length > obj.translatedIndex) {
          this.meteors.push({ text: state.translated, top, timestamp, color: 'springgreen' })
        }

        return {
          top,
          transcriptIndex: state.transcriptList.length,
          translatedIndex: state.translatedList.length,
        }
      }, initialObj)
      .subscribe(() => {
        this.cd.markForCheck()

        /* filtering array */
        const now = new Date().getTime()
        this.meteors = this.meteors.filter(meteor => meteor.timestamp > now - 1000 * 20) // 15秒後に削除する。
      })
  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }


  getTopPosition(previousTop: number): number {
    let top: number
    do {
      top = (this.screenHeight * 0.8) * Math.random() // 高さをランダムに決定。
    } while (Math.abs(top - previousTop) < (this.screenHeight / 10)) // 前回と縦10分割位以上の差がつくこと。
    return top
  }


  getTopPosition2(previousTop: number, diff: number): number {
    if (previousTop + diff > this.screenHeight * 0.8) {
      return 0
    } else {
      return previousTop + diff
    }
  }

}



interface Meteor {
  text: string
  top: number
  timestamp: number
  color: string
}


interface ScanLoopObject {
  top: number
  transcriptIndex: number
  translatedIndex: number
}
