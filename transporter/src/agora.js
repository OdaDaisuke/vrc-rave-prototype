import AgoraRTC from 'agora-rtc-sdk-ng';
import { appConfig } from './config';

export const AGORA_MODE_LIVE = 'live';
export const AGORA_MODE_RTC = 'rtc';

const modeList = [AGORA_MODE_LIVE, AGORA_MODE_RTC];

export class Agora {
  constructor(mode) {
    if (!modeList.includes(mode)) {
      mode = AGORA_MODE_LIVE;
    }
    this.appId = appConfig.APP_ID;
    this.appCertificate = appConfig.APP_CERTIFICATE;
    this.tokenApiUrl = `${appConfig.API_BASE_URL}/access_token`;
    this.client = AgoraRTC.createClient({ mode, codec: 'vp8' });
    this.handleUserPublished = this.handleUserPublished.bind(this);
    this.client.on("user-published", this.handleUserPublished);
  }

  async handleUserPublished(user, mediaType) {
    await this.client.subscribe(user, mediaType);
    const event = new CustomEvent("received-remote-stream", {
      detail: {
        user,
        mediaType,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * 音声トラックを設定
   * @param {Object} audioTrack 
   */
  setAudio(audioTrack) {
    this.audioTrack = audioTrack;
  }

  /**
   * 映像トラックを設定
   * @param {Object} videoTrack 
   */
  setVideo(videoTrack) {
    this.videoTrack = videoTrack;
  }

  async publishMixedStream() {
    if (!this.audioTrack) {
      throw new Error('No audio track detected.')
    }
    const localTracks = {
      videoTrack: AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: this.videoTrack,
      }),
      audioTrack: AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: this.audioTrack,
      }),
    };
    this.client.publish(Object.values(localTracks));
  }

  /**
   * Remoteに音声送信
   */
  async publishAudio() {
    if (!this.audioTrack) {
      throw new Error('No audio track detected.')
    }
    const agoraAudioTrack = AgoraRTC.createCustomAudioTrack({
      mediaStreamTrack: this.audioTrack,
    });
    this.client.publish([agoraAudioTrack]);
  }

  /**
   * チャンネルに讃歌
   */
  async joinChannel(channelName) {
    const token = await this.fetchToken(channelName);
    const uid = await this.client.join(token, channelName, null);
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
}
