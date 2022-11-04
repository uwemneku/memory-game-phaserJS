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
type StaticData = { key: string; frame: number }[];
type DynamicData = ({
  key: string;
} & Phaser.Types.Animations.GenerateFrameNumbers)[];

class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.spritesheet(sokoban, "./assets/tilesheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    images.forEach((i) => this.load.image(i.name, `./assets/${i.img}`));
  }
  create() {
    this.generatePlayerAnimation("idle", [
      { key: DOWN_IDLE, frame: 52 },
      { key: UP_IDLE, frame: 55 },
      { key: RIGHT_IDLE, frame: 78 },
      { key: LEFT_IDLE, frame: 81 },
    ]);
    this.generatePlayerAnimation("walk", [
      { key: DOWN_WALK, start: 52, end: 54 },
      { key: UP_WALK, start: 55, end: 57 },
      { key: RIGHT_WALK, start: 78, end: 80 },
      { key: LEFT_WALK, start: 81, end: 83 },
    ]);
    this.scene.start("game");
  }
  update() {}
  generatePlayerAnimation = <T extends "idle" | "walk">(
    x: T,
    y: T extends "idle" ? StaticData : DynamicData
  ) => {
    switch (x) {
      case "idle":
        (y as StaticData).forEach(({ frame, key }) => {
          this.anims.create({
            key,
            frames: [{ key: sokoban, frame }],
          });
        });
        break;
      case "walk":
        (y as DynamicData).forEach(({ key, ...arr }) => {
          this.anims.create({
            key,
            frames: this.anims.generateFrameNumbers(sokoban, {
              ...arr,
            }),
            frameRate: 10,
            repeat: -1,
          });
        });
        break;
    }
  };
}

export default Preloader;
