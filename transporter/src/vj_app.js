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

    this.onReceiveRemoteStream = this.onReceiveRemoteStream.bind(this);
    this.onClickPublish = this.onClickPublish.bind(this);
    this.onClickJoinRoom = this.onClickJoinRoom.bind(this);

    /** Promise<MediaStream> */
    this.stream = undefined;
    this.audioTrack = undefined;

    this.agora = new Agora();

    this.dom.$joinRoomBtn.addEventListener('click', this.onClickJoinRoom)
    this.dom.$publishButton.addEventListener('click', this.onClickPublish);
    document.addEventListener('received-remote-stream', this.onReceiveRemoteStream);
  }

  /**
   * アプリの起動
   * @returns null
   */
  async run() {
    this.videoStream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true,
    });
    const videoTracks = this.videoStream.getVideoTracks();
    if (videoTracks.length <= 0) {
      alert('動画が検出できませんでした。');
      return;
    }
    this.agora.setVideo(videoTracks[0]);
    this.dom.$videoDevice.innerText = `接続デバイス：${videoTracks[0].label}`;
    this.dom.$myVideo.srcObject = this.videoStream;
  }

  async onReceiveRemoteStream(e) {
    if (!this.dom) {
      return;
    }
    if (e.detail.mediaType === "audio") {
      const remoteAudioTrack = e.detail.user.audioTrack;
      this.audioTrack = remoteAudioTrack.getMediaStreamTrack();
      this.dom.$receivedAudioTrack.innerText = `受け取った音声: ${this.audioTrack.label}`;
      this.agora.setAudio(this.audioTrack);
      // プレビュー確認用に、音声トラック追加
      this.videoStream.addTrack(this.audioTrack);
    }
  }

  async onClickPublish() {
    this.agora.publishMixedStream();
  }

  async onClickJoinRoom() {
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