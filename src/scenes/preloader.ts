import { SceneKeys, soundData, SoundKeys } from "./../constants/assets";
import Phaser from "phaser";
import {
  DOWN_IDLE,
  DOWN_WALK,
  LEFT_IDLE,
  LEFT_WALK,
  RIGHT_IDLE,
  RIGHT_WALK,
  UP_IDLE,
  UP_WALK,
} from "../constants/animation";
import { images, sokoban } from "../constants/assets";
type StaticData = { key: string; frame: number };
type DynamicData = {
  key: string;
} & Phaser.Types.Animations.GenerateFrameNumbers;

class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.preloader);
  }
  init() {
    this.scene.run(SceneKeys.loading);
  }
  preload() {
    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );

    this.load.spritesheet(sokoban, "./assets/tilesheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    images.forEach((i) => this.load.image(i.name, `./assets/${i.img}`));
    this.load.audio(SoundKeys.Music, "./assets/music/8Bit-Mini-Gamer-Loop.wav");
    soundData.forEach(({ fileName, key }) => {
      this.load.audio(key, `./assets/sfx/${fileName}`);
    });
  }
  create() {
    /* Starting the game scene. */
    this.time.delayedCall(2000, () => {
      this.scene.stop(SceneKeys.loading);
      this.scene.start(SceneKeys.game);
    });
  }
  update() {}
}

export default Preloader;
