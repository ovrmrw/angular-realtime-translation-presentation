import { OpaqueToken } from '@angular/core'

export { StoreQueueConcurrent, StoreInitialState } from './lib/simple-store'
export { WatsonSpeechToTextStartOption } from './lib/websocket'


export const SlideUrl = new OpaqueToken('SlideUrl')

export const GcpTranslatorUrl = new OpaqueToken('GcpTranslatorUrl')

export const McsTranslatorUrl = new OpaqueToken('McsTranslatorUrl')

export const UseMockTranslator = new OpaqueToken('UseMockTranslator')
