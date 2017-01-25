import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs'

import { Disposer } from '../../lib/class'
import { ReactiveStoreService, KEY } from '../../state'


@Component({
  selector: 'app-comet-tower',
  template: `
    <app-comet *ngFor="let c of comets; let i = index" [text]="c.text" [top]="c.top" [color]="c.color" [index]="i + 1">
    </app-comet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CometTowerComponent extends Disposer implements OnInit, OnDestroy {
  comets: Comet[] = []
  screenHeight: number


  constructor(
    private store: ReactiveStoreService,
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
        this.comets.push({ text, top, timestamp, color: 'lightgreen' })
        this.cd.markForCheck()

        /* filtering array */
        this.comets = this.comets.filter(meteor => meteor.timestamp > timestamp - 1000 * 20) // 20秒後に削除する。
      })
  }


  private initGetState(): void {
    this.disposable = this.store.getter()
      .filterByUpdatedKey(KEY.windowState)
      .subscribe(state => {
        this.screenHeight = state.windowState.innerHeight
      })


    const initialObj: ScanLoopObject = {
      top: 0,
      transcriptIndex: 0,
      translatedIndex: 0,
    }

    this.disposable = this.store.getter()
      .filterByUpdatedKey(KEY.transcriptList, KEY.translatedList)
      .scan((obj, state) => {
        const timestamp = new Date().getTime()
        // const top = this.getTopPosition(obj.top)
        const top = this.getTopPosition2(obj.top, 70)

        if (state.transcriptList.length > obj.transcriptIndex) {
          this.comets.push({ text: state.transcript, top, timestamp, color: 'white' })
        }
        if (state.translatedList.length > obj.translatedIndex) {
          this.comets.push({ text: state.translated, top, timestamp, color: 'springgreen' })
        }

        return {
          top,
          transcriptIndex: state.transcriptList.length,
          translatedIndex: state.translatedList.length,
        }
      }, initialObj)
      .subscribe(() => {
        /* filtering array */
        const now = new Date().getTime()
        this.comets = this.comets.filter(comet => comet.timestamp > now - 1000 * 20) // 20秒後に削除する。

        this.cd.markForCheck()
      })
  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }


  /**
   * Cometを表示する高さをランダムに設定するアルゴリズム。
   */
  getTopPosition(previousTop: number): number {
    let top: number
    do {
      top = Math.round((this.screenHeight * 0.8) * Math.random()) // 高さをランダムに決定。
    } while (Math.abs(top - previousTop) < (this.screenHeight / 10)) // 前回と縦10分割位以上の差がつくこと。
    return top
  }


  /**
   * Cometを表示する高さをランダムではなく上から順に決定していくアルゴリズム。
   */
  getTopPosition2(previousTop: number, diff: number): number {
    if (previousTop + diff > this.screenHeight * 0.7) {
      return 0
    } else {
      return Math.round(previousTop + diff)
    }
  }

}



interface Comet {
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
