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
  start(duration = 45000, callback: () => void) {
    this.stop();
    this.duration = duration;
    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callbackScope: this.scene,
      callback,
    });

    return this;
  }
  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }
    return this;
  }
  restart() {
    return this;
  }
  update() {
    const elapsed = this.timerEvent?.getElapsed() || 0;
    const remaining = this.duration - elapsed;
    const text = (remaining / 1000).toFixed(2);
    this.label.setText(text);
  }
}
