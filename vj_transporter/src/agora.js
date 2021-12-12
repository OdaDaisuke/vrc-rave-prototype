import AgoraRTC from "agora-rtc-sdk-ng"
import { appConfig } from './config'

export class Agora {
  constructor() {
    this.channelName = ''
    this.appId = appConfig.APP_ID;
    this.appCertificate = appConfig.APP_CERTIFICATE;
    this.tokenApiUrl = `${appConfig.API_BASE_URL}/access_token`;
    this.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    this.handleUserPublished = this.handleUserPublished.bind(this);
    this.client.on("user-published", this.handleUserPublished);
  }

  async handleUserPublished(user, mediaType) {
    await this.client.subscribe(user, mediaType);
    if (mediaType === "audio") {
      const remoteAudioTrack = user.audioTrack;
      remoteAudioTrack.play();
    }
  }

  setChannelName(channelName) {
    this.channelName = channelName;
  }

  /**
   * チャンネルに讃歌
   */
  async joinChannel() {
    await this.client.setClientRole("host");
    const token = await this.fetchToken(this.channelName);
    const uid = await this.client.join(token, this.channelName, null);
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
