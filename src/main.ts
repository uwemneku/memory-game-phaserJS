import Phaser from "phaser";
import GameScene from "./scenes/game";
import Loading from "./scenes/Loading";
import Preloader from "./scenes/preloader";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

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
    },
  },
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: UIPlugin,
        mapping: "rexUI",
      },
    ],
  },
  scale: {
    // mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.DOM,
  },
  scene: [Preloader, Loading, GameScene],
};

new Phaser.Game(config);
