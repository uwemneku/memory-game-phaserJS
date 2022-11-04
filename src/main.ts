import Phaser from "phaser";
import GameScene from "./scenes/game";
import Preloader from "./scenes/preloader";

const width = 600;
const height = width;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width,
  height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scale: {
    // mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.DOM,
  },
  scene: [Preloader, GameScene],
};

new Phaser.Game(config);
