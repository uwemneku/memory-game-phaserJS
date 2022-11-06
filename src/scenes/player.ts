import Phaser from "phaser";
import {
  DOWN_IDLE,
  DOWN_WALK,
  LEFT_WALK,
  RIGHT_WALK,
  UP_WALK,
} from "../constants/animation";
import { sokoban } from "../constants/assets";

type Direction = "left" | "right" | "up" | "down";
export default class Player {
  player: Phaser.Physics.Arcade.Sprite;
  constructor(
    add: Phaser.Physics.Arcade.Factory,
    scale: Phaser.Scale.ScaleManager
  ) {
    const { width, height } = scale;
    this.player = add.sprite(width / 2, height / 2.5, sokoban).play(DOWN_IDLE);
    this.player.body.setSize(
      this.player.width * 0.7,
      this.player.height * 0.75
    );
    this.player.setCollideWorldBounds(true);
  }
  getPlayer() {
    return this.player;
  }
  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    onMove: (x: number, y: number) => void
  ) {
    // movement animation
    const { down, left, right, up } = cursors;
    const animationDirection: Direction | undefined = down.isDown
      ? "down"
      : left.isDown
      ? "left"
      : right.isDown
      ? "right"
      : up.isDown
      ? "up"
      : undefined;
    this.walk(animationDirection);

    onMove(this.player.x, this.player.y);
  }
  walk(dir?: Direction) {
    const speed = 200;
    const prevAnimationDirection =
      this.player.anims.currentAnim.key.split("-")[0];
    const currentAnimation: { key: string; velocity: [number, number] } =
      dir === "down"
        ? { key: DOWN_WALK, velocity: [0, speed] }
        : dir === "left"
        ? { key: LEFT_WALK, velocity: [-speed, 0] }
        : dir === "right"
        ? { key: RIGHT_WALK, velocity: [speed, 0] }
        : dir === "up"
        ? { key: UP_WALK, velocity: [0, -speed] }
        : {
            key: `${prevAnimationDirection}-idle`,
            velocity: [0, 0],
          };
    this.player.play(currentAnimation.key, true);
    this.player.setVelocity(...currentAnimation.velocity);
  }
}
