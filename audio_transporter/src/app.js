import { Agora } from './agora'

class App {
  constructor () {
    console.log('run');
    this.dom = {
      $channelName: document.querySelector('#channel-name'),
      $createRoomBtn: document.querySelector('#create-room'),
      $status: document.querySelector('#status'),
      $audioDevice: document.querySelector('#audio-device'),
      $channelUid: document.querySelector('#uid'),
      $controllAudio: document.querySelector('#controll-audio'),
    };
    this.audioTrack = null;
    this.agora = new Agora();
    this.onSubmit = this.onSubmit.bind(this);
    this.onClickAudioControl = this.onClickAudioControl.bind(this);
    this.dom.$createRoomBtn.addEventListener('click', this.onSubmit);
    this.dom.$controllAudio.addEventListener('click', this.onClickAudioControl);
  }

  async run() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    console.log('stream', stream);
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length <= 0) {
      alert('オーディオが検出できませんでした。');
      return;
    }
    this.audioTrack = audioTracks[0]
    this.dom.$audioDevice.innerText = `接続デバイス：${this.audioTrack.label}`;
    this.agora.setAudio(this.audioTrack);
    const audioCtx = new AudioContext();
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
    const source = audioCtx.createMediaStreamSource(stream);
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode
    // source.connect(audioCtx.destination);
  }
  
  onClickAudioControl() {
  }

  async onSubmit() {
    try {
      const channelName = this.dom.$channelName.value;
      if (!channelName || channelName.length <= 0) {
        alert('チャンネル名が入力されていません。');
        return;
      }
      this.agora.setChannelName(channelName);
      const uid = await this.agora.sendAudio();
      this.dom.$status.classList.remove('status--failure')
      this.dom.$status.classList.add('status--success')
      this.dom.$status.innerText = '接続成功';
      this.dom.$channelUid.innerText = `UID: ${uid}`;
    } catch (e) {
      console.error(e);
      this.dom.$status.classList.add('status--failure')
      this.dom.$status.classList.remove('status--success')
      this.dom.$status.innerText = JSON.stringify(e);
    }
  }
}

window.addEventListener('load', () => {
  (new App()).run()
});
