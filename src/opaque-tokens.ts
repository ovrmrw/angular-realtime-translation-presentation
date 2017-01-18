import { OpaqueToken } from '@angular/core'

export { WatsonSpeechToTextStartOption } from './lib/websocket'


export const GcpTranslatorUrl = new OpaqueToken('GcpTranslatorUrl')

export const McsTranslatorUrl = new OpaqueToken('McsTranslatorUrl')

export const UseMockTranslator = new OpaqueToken('UseMockTranslator')
