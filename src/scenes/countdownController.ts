export default class CountdownController {
  scene: Phaser.Scene;
  label: Phaser.GameObjects.Text;
  timerEvent: Phaser.Time.TimerEvent | undefined;
  duration: number;
  constructor(scene: Phaser.Scene, label: Phaser.GameObjects.Text) {
    this.scene = scene;
    this.label = label;
    this.duration = 0;
  }
  start(callback?: () => void, duration = 10000) {
    this.stop();
    this.duration = duration;
    this.timerEvent = this.scene.time.addEvent({
      delay: duration,

      callback: () => {
        this.label.text = "0";
        this.stop();
        if (callback) callback();
      },
    });
  }
  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }
  }
  update() {
    if (!this.timerEvent || this.duration <= 0) return;
    const elapsedTime = this.timerEvent?.getElapsed();
    const remaining = this.duration - elapsedTime;
    const seconds = remaining / 1000;
    this.label.text = seconds.toFixed(3);
    if (seconds) {
    }
  }
}
