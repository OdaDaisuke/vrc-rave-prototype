export class Audio {
  constructor() {
  }

  async fetchDevice() {
    this.audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    const input = this.audioContext.createMediaStreamSource(stream);
  }
}
