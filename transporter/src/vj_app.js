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
      $myVideo: document.querySelector('#my-video'),
    };
    this.stream = undefined;
    this.audioTrack = undefined;
    this.agora = new Agora();
    this.handleUserPublished = this.handleUserPublished.bind(this);
    this.publish = this.publish.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.dom.$joinRoomBtn.addEventListener('click', this.joinRoom)
    this.dom.$publishButton.addEventListener('click', this.publish);
    document.addEventListener('received-remote-stream', this.handleUserPublished);
  }

  async run() {
    this.stream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true,
    });
    const videoTracks = this.stream.getVideoTracks();
    if (videoTracks.length <= 0) {
      alert('動画が検出できませんでした。');
      return;
    }
    this.dom.$videoDevice.innerText = `接続デバイス：${videoTracks[0].label}`;
    this.agora.setVideo(videoTracks[0]);
    this.dom.$myVideo.srcObject = this.stream;
  }

  async handleUserPublished(e) {
    if (!this.dom) {
      return;
    }
    if (e.detail.mediaType === "audio") {
      const remoteAudioTrack = e.detail.user.audioTrack;
      this.audioTrack = remoteAudioTrack.getMediaStreamTrack();
      this.dom.$receivedAudioTrack.innerText = `受け取った音声: ${this.audioTrack.label}`;
      this.stream.addTrack(this.audioTrack);
      this.agora.setVideo(this.stream.getVideoTracks()[0]);
    }
  }

  async publish() {
    this.agora.setAudio(this.audioTrack);
    this.agora.publish();
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