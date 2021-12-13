import AgoraRTC from "agora-rtc-sdk-ng"
import { appConfig } from './config'

export class Agora {
  constructor() {
    this.channelName = ''
    this.appId = appConfig.APP_ID;
    this.appCertificate = appConfig.APP_CERTIFICATE;
    this.tokenApiUrl = `${appConfig.API_BASE_URL}/access_token`;
    this.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    this.client.on("user-published", this.handleUserPublished);
  }

  handleUserPublished() {
  }

  setChannelName(channelName) {
    this.channelName = channelName;
  }

  /**
   * 音声トラックを設定
   * @param {Object} audioTrack 
   */
  setAudio(audioTrack) {
    this.audioTrack = audioTrack;
  }

  /**
   * Remoteに音声送信
   */
  async sendAudio() {
    if (!this.audioTrack) {
      throw new Error('No audio track detected.')
    }
    const localTracks = {
      videoTrack: null,
      audioTrack: AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: this.audioTrack,
      }),
    };
    // TODO: mute
    localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.client.setClientRole("host");
    const token = await this.fetchToken(this.channelName);
    const uid = await this.client.join(token, this.channelName, null);
    this.client.publish(Object.values(localTracks));
    return uid;
  }

  async fetchToken(channelName) {
    const endpoint = `${this.tokenApiUrl}?channelName=${channelName}`
    const res = await fetch(endpoint, {
      method: 'GET',
    });
    const rawData = await res.json();
    return rawData.token;
  }

  leave() {
  }
}
