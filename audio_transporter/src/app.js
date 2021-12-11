import { Audio } from './audio'
import { Agora } from './agora'

class App {
  constructor () {
    console.log('run')
  }

  async run() {
    const audio = new Audio()
    await audio.fetchDevice()
    // デバイスを選択
    // デバイスの音声取得
    // Agoraに送る
    // 切断
  }
}

(new App()).run()
