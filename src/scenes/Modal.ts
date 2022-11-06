import Phaser from "phaser";
export default class Modal {
  group: Phaser.GameObjects.Group;
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;
    this.group = scene.add.group();
    this.scene = scene;
    const graphics = scene.add
      .graphics()
      .setInteractive()
      .on("pointerdown", () => {
        this.hide();
      });
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRoundedRect(width / 2 - 150, height / 2 - 100, 300, 200, 15);
    const text = scene.add
      .text(width / 2, height / 2, "Press A to Start", { color: "#000000" })
      .setOrigin(0.5);
    console.log(text.type);

    this.group.addMultiple([graphics, text]);
    this.group.setDepth(50000);
  }
  hide() {
    this.group.children.iterate((i) => {
      this.scene.add.tween({
        targets: i,
        alpha: 0,
        duration: 250,
      });
    });

    return this;
  }
  show() {
    this.scene.add.tween({
      targets: this.group.getChildren(),
      alpha: 1,
      duration: 250,
    });
  }
  destroy() {
    this.group.children.iterate((i) => {
      i.destroy(true);
    });
  }
}
