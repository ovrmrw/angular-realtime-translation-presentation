export const storeQueueConcurrent: number = 99


export const watsonSpeechToTextStartOption = {
  interim_results: true,
  continuous: true,
  // word_confidence: true,
  // timestamps: true,
  // max_alternatives: 3,
  inactivity_timeout: 60, // 30,
  // word_alternatives_threshold: 0.001,
  // smart_formatting: true,
  profanity_filter: true, // reject bad words.
  // speaker_labels: true, Broadband Models are not supported.
}


export const gcpTranslatorUrl: string = 'http://localhost:4000/api/gcp/translator'
export const mcsTranslatorUrl: string = 'http://localhost:4000/api/mcs/translator'


export const useMockTranslator: boolean = false


export const slideViewerId: string = 'slide-viewer'
