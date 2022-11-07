import { SceneKeys, soundData, SoundKeys } from "./../constants/assets";
import Phaser from "phaser";
import { images, sokoban } from "../constants/assets";

class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.preloader);
  }
  init() {
    this.scene.run(SceneKeys.loading);
  }
  preload() {
    this.load.spritesheet(sokoban, "./assets/tilesheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.atlasXML(
      "button",
      "./assets/greenSheet.png",
      "./assets/greenSheet.xml"
    );
    images.forEach((i) => this.load.image(i.name, `./assets/${i.img}`));
    this.load.audio(SoundKeys.Music, "./assets/music/8Bit-Mini-Gamer-Loop.wav");
    soundData.forEach(({ fileName, key }) => {
      this.load.audio(key, `./assets/sfx/${fileName}`);
    });
  }
  create() {
    /* Starting the game scene. */
    this.scene.stop(SceneKeys.loading);
    this.scene.start(SceneKeys.game);
  }
  update() {}
}

export default Preloader;
