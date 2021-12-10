import AgoraRTC from "agora-rtc-sdk-ng"

export class Agora {
  constructor() {
    this.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    this.client.on("user-published", this.handleUserPublished);
    this.appId = ''
    this.channel = ''
    this.token = ''
  }

  handleUserPublished() {
  }

  /**
   * 音声トラックを設定
   * @param {Object} audioTrack 
   */
  setAudio(audioTrack) {
    this.audioTrack = audioTrack
  }

  /**
   * Remoteに音声送信
   */
  sendAudio() {
    const localTracks = {
      videoTrack: null,
      audioTrack: this.audioTrack,
    };
    this.client.join(this.appId, this.channel, this.token);
    this.client.publish(Object.values(localTracks));
  }

  leave() {
  }
}
