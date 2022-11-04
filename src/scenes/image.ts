import Phaser from "phaser";

export default class Image {
  scene: Phaser.Scene;
  object: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, object: Phaser.GameObjects.Sprite) {
    this.scene = scene;
    this.object = object;
    object.setData("isImage", true);
  }
  animate(mode: "close" | "open", onComplete: () => {}) {
    const isOpen = mode === "open";
    this.scene.tweens.add({
      targets: this.object,
      y: isOpen ? "-=50" : "+=0",
      alpha: isOpen ? 1 : 0,
      scale: isOpen ? 1 : 0,
      delay: isOpen ? 0 : 500,
      duration: 250,
      onComplete,
    });
  }
}
