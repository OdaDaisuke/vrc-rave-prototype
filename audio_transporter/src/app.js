import AgoraRTC from 'agora-rtc-sdk-ng'
import { Audio } from './audio'
import { Agora } from './agora'

class App {
  constructor () {
    console.log('run');
  }

  async run() {
    const audio = new Audio();
    const agora = new Agora();
    const audioStream = await audio.fetchStream();
    const audioTracks = audioStream.getAudioTracks()
    // TODO: 任意のチャンネル
    agora.setChannelName('test')
    agora.setAudio(audioTracks[0])
    agora.sendAudio()    
  }
}

(new App()).run()
