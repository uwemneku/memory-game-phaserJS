import Phaser from "phaser";
import Buttons from "phaser3-rex-plugins/templates/ui/buttons/Buttons";
// import { Buttons } from "phaser3-rex-plugins/templates/ui/ui-components";
export default class Modal {
  group: Phaser.GameObjects.Group;
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;
    this.group = scene.add.group();
    this.scene = scene;
    const graphics = scene.add.graphics();

    graphics.fillStyle(0xffffff, 1);
    graphics
      .fillRoundedRect(width / 2 - 150, height / 2 - 100, 300, 200, 15)
      .setInteractive({})
      .on("pointerdown", () => {
        console.log("yoo");
      });

    const text = scene.add
      .text(width / 2, height / 2, "Press A to Start", { color: "#000000" })
      .setOrigin(0.5);

    this.group.addMultiple([graphics, text]);
    this.group.setDepth(500000000);
    console.log(this.group);
    var buttons = new Buttons(scene, {
      orientation: 0,
      buttons: [text],
      click: {
        mode: "pointerdown",
      },
    });
    scene.add.existing(buttons);
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
