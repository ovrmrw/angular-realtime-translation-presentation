export const firebaseConfig = {
  apiKey: 'AIzaSyCeEwvpK6Ov52vwsjpmvlUPhovRi8s7BLc',
  authDomain: 'fir-as-a-store-2.firebaseapp.com',
  databaseURL: 'https://fir-as-a-store-2.firebaseio.com',
  // storageBucket: "fir-as-a-store-2.appspot.com",
  // messagingSenderId: "983094407916"
}


export const storeQueueConcurrent: number = 99


export const watsonSpeechToTextStartOption = {
  'content-type': 'audio/l16;rate=16000',
  'interim_results': true,
  'continuous': true,
  'word_confidence': true,
  'timestamps': true,
  // 'max_alternatives': 3,
  'inactivity_timeout': 20, // 30,
  // 'word_alternatives_threshold': 0.001,
  'smart_formatting': true,
}


export const gcpTranslatorUrl: string = 'http://localhost:4000/api/gcp/translator'
export const mcsTranslatorUrl: string = 'http://localhost:4000/api/mcs/translator'


export const useMockTranslator: boolean = false


export const slideViewerId: string = 'slide-viewer'
