export class Audio {
  constructor() {
  }

  async fetchStream() {
    this.audioContext = new AudioContext();
    return await navigator.mediaDevices.getUserMedia({
      audio: true
    });
  }
}
