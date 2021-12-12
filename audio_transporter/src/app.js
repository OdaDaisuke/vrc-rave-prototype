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
    };
    this.audio = new Audio();
    this.agora = new Agora();
    this.onSubmit = this.onSubmit.bind(this);
    this.dom.$createRoomBtn.addEventListener('click', this.onSubmit)
  }

  async run() {
    const displayMediaList = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    const audioTracks = displayMediaList.getAudioTracks();
    if (audioTracks.length <= 0) {
      alert('オーディオが検出できませんでした。');
      return;
    }
    this.dom.$audioDevice.innerText = `接続デバイス：${audioTracks[0].label}`;
    this.agora.setAudio(audioTracks[0]);
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
