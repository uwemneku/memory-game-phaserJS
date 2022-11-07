import { SceneKeys } from "./../constants/assets";
import Phaser from "phaser";
export default class Loading extends Phaser.Scene {
  constructor() {
    super(SceneKeys.loading);
  }
  create() {
    const { width, height } = this.scale;
    const left = this.add.circle(width * 0.45, height * 0.45, 8, 0xffffff);
    const middle = this.add.circle(width * 0.5, height * 0.45, 8, 0xffffff);
    const right = this.add.circle(width * 0.55, height * 0.45, 8, 0xffffff);
    const loadingText = this.add
      .text(width * 0.5, height * 0.5, "Loading", {
        fontSize: "42px",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: loadingText,
      alpha: 0.3,
      repeat: -1,
      yoyo: true,
    });
    const circleGroup = this.add.group();
    circleGroup.addMultiple([left, middle, right]);
    circleGroup.children.iterate((i, index) => {
      this.tweens.add({
        targets: i,
        y: "-=20",
        duration: 300,
        delay: index * 150,
        repeat: -1,
        yoyo: true,
        repeatDelay: 150,
        ease: Phaser.Math.Easing.Sine.InOut,
      });
    });
  }
}
