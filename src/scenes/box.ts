import { imageKeys, sokoban } from "../constants/assets";

export default class Box extends Phaser.Physics.Arcade.Sprite {
  isMatched = false;
  isActive = false;
  isOpen = false;
  boxImage: Phaser.GameObjects.Image;
  tweens: Phaser.Tweens.TweenManager;
  imageKey: string;
  constructor(scene: Phaser.Scene, x: number, y: number, imageIndex: number) {
    super(scene, x, y, sokoban, 10);
    this.imageKey = imageKeys[imageIndex];
    this.boxImage = scene.add
      .image(x, y, this.imageKey)
      .setDepth(2000)
      .setScale(0)
      .setAlpha(0);
    this.tweens = scene.tweens;
    scene.add.existing(this);
  }

  setIsActive(state: boolean) {
    if (this.isMatched) return;
    this.isActive = state;
    const frame = state ? 9 : 10;
    this.setFrame(frame);
  }
  setIsMatched(state: boolean) {
    this.isMatched = state;
    this.setFrame(8);
  }

  open(callBack: () => void) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.tweens.add({
      targets: this.boxImage,
      y: "-=50",
      alpha: 1,
      scale: 1,
      duration: 250,
      onComplete: () => {
        callBack();
      },
    });
  }
  close(callBack: () => void) {
    this.tweens.add({
      targets: this.boxImage,
      y: this.y,
      alpha: 0,
      scale: 0,
      duration: 250,
      delay: 250,
      onComplete: () => {
        this.isOpen = false;
        callBack();
      },
    });
  }
}
