import { Agora } from './agora'

class App {
  constructor () {
    this.dom = {
      $channelName: document.querySelector('#channel-name'),
      $joinRoomBtn: document.querySelector('#join-room'),
      $status: document.querySelector('#status'),
    };
    this.audio = new Audio();
    this.agora = new Agora();
    this.joinRoom = this.joinRoom.bind(this);
    this.dom.$joinRoomBtn.addEventListener('click', this.joinRoom)
  }

  async run() {
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
