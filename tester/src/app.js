import AgoraRTC from "agora-rtc-sdk-ng"
import { appConfig } from './config'

class Agora {
  constructor() {
    this.appId = appConfig.APP_ID;
    this.appCertificate = appConfig.APP_CERTIFICATE;
    this.tokenApiUrl = `${appConfig.API_BASE_URL}/access_token`;
    this.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    this.handleUserPublished = this.handleUserPublished.bind(this);
    this.handleStreamAdded = this.handleStreamAdded.bind(this);
    this.client.on("user-published", this.handleUserPublished);
    this.client.on("stream-added", this.handleStreamAdded);
    this.client.on('stream-subscribe', (evt) => {
      console.log('SSVJ subscribed')
      const stream = evt.stream;
      const streamId = stream.getId();
      let streamDiv=document.createElement("div");
      streamDiv.id=streamId;
      streamDiv.style.transform="rotateY(180deg)";
      document.querySelector('#stream-container').appendChild(streamDiv);
      stream.play(streamId);
      let canvas=document.createElement("canvas");
      canvas.id='canvas'+streamId;
      document.querySelector('#canvas-container').appendChild(canvas);
      let ctx = canvas.getContext('2d');
      let video=document.getElementById(`video${streamId}`);

      video.addEventListener('loadedmetadata', function() {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
      });

      video.addEventListener('play', function() {
          var $this = this; //cache
          (function loop() {
              if (!$this.paused && !$this.ended) {
                  ctx.drawImage($this, 0, 0);
                  setTimeout(loop, 1000 / 30); // drawing at 30fps
              }
          })();
      }, 0);
    });
  }
  
  async handleStreamAdded(evt) {
    console.log('[SSVJ] subscribe')
    this.client.subscribe(evt.stream, (e) => {
      console.error('SSVJ', e);
    });
  }

  async handleUserPublished(user, mediaType) {
    console.log('[SSVJ]user-published', user)
    await this.client.subscribe(user, mediaType);
    const event = new CustomEvent("received-user-stream", {
      detail: {
        user,
        mediaType,
      },
    });
    document.dispatchEvent(event);
  }
  
  /**
   * チャンネルに讃歌
   */
  async joinChannel(channelName) {
    // await this.client.setClientRole("host");
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

class App {
  constructor () {
    console.log('run');
    this.dom = {
      $channelName: document.querySelector('#channel-name'),
      $joinRoomBtn: document.querySelector('#join-room'),
      $status: document.querySelector('#status'),
    };
    this.agora = new Agora();
    this.onJoin = this.onJoin.bind(this);
    this.dom.$joinRoomBtn.addEventListener('click', this.onJoin)
  }

  async run() {
  }

  async onJoin() {
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
