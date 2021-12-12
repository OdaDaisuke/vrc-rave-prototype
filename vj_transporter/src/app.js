import { Agora } from './agora'

class App {
  constructor () {
    this.dom = {
      $channelName: document.querySelector('#channel-name'),
      $joinRoomBtn: document.querySelector('#join-room'),
      $status: document.querySelector('#status'),
      $videoDevice: document.querySelector('#video-device'),
      $publishButton: document.querySelector('#publish-stream'),
      $receivedAudioTrack: document.querySelector('#received-audio'),
    }
    this.agora = new Agora(this.handleUserPublished);
    this.publish = this.publish.bind(this);
    this.handleUserPublished = this.handleUserPublished.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.audioTrack = null;
    this.dom.$joinRoomBtn.addEventListener('click', this.joinRoom)
    this.dom.$publishButton.addEventListener('click', this.publish);
    document.addEventListener('received-user-stream', this.handleUserPublished);
  }

  async run() {
    const displayMediaList = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true,
    });
    const videoTracks = displayMediaList.getVideoTracks();
    if (videoTracks.length <= 0) {
      alert('動画が検出できませんでした。');
      return;
    }
    this.dom.$videoDevice.innerText = `接続デバイス：${videoTracks[0].label}`;
    this.agora.setVideo(videoTracks[0]);
  }

  async handleUserPublished(e) {
    if (!this.dom) {
      return;
    }
    if (e.detail.mediaType === "audio") {
      const remoteAudioTrack = e.detail.user.audioTrack;
      this.audioTrack = remoteAudioTrack.getMediaStreamTrack();
      this.dom.$receivedAudioTrack.innerText = `受け取った音声: ${this.audioTrack.label}`;
    }
  }

  async publish() {
    this.agora.setAudio(this.audioTrack);
    this.agora.publishMixedMedia();
  }

  async joinRoom() {
    try {
      const channelName = this.dom.$channelName.value;
      if (!channelName || channelName.length <= 0) {
        alert('チャンネル名が入力されていません。');
        return;
      }
      this.agora.joinChannel(channelName);
      this.dom.$status.classList.remove('status--failure')
      this.dom.$status.classList.add('status--success')
      this.dom.$status.innerText = '接続成功';
      // 同じルームに対して、受け取った音声と外部の映像ソースを取ってきてmixして打ち上げ。
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
