import { imageKeys, sokoban } from "../constants/assets";

export default class Box extends Phaser.Physics.Arcade.Sprite {
  isSelected = false;
  isActive = false;
  isOpen = false;
  boxImage: Phaser.GameObjects.Image;
  tweens: Phaser.Tweens.TweenManager;

  constructor(scene: Phaser.Scene, x: number, y: number, imageIndex: number) {
    super(scene, x, y, sokoban, 10);
    this.boxImage = scene.add
      .image(x, y, imageKeys[imageIndex])
      .setDepth(2000)
      .setScale(0)
      .setAlpha(0);
    this.tweens = scene.tweens;
    scene.add.existing(this);
  }

  setIsActive(state: boolean) {
    this.isActive = state;
    const frame = state ? 9 : 10;
    this.setFrame(frame);
  }
  setIsSelected(state: boolean) {
    this.isActive = state;
    this.setFrame(9);
  }
  setIsOpen(state: boolean) {
    this.isOpen = state;
  }
  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.tweens.add({
      targets: this.boxImage,
      y: "-=50",
      alpha: 1,
      scale: 1,
      duration: 250,
    });
  }
}
