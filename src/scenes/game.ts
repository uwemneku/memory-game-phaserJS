import Phaser from "phaser";
import {
  DOWN_WALK,
  LEFT_WALK,
  RIGHT_WALK,
  UP_WALK,
} from "../constants/animation";
import { bear, imageKeys, sokoban } from "../constants/assets";
import CountdownController from "./countdownController";
const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2],
];

class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  boxGroup!: Phaser.Physics.Arcade.StaticGroup;
  itemsGround!: Phaser.GameObjects.Group;
  activeBox: Phaser.Physics.Arcade.Sprite | undefined;
  matchCount: number = 0;
  countdown: CountdownController | undefined;
  selectedBoxes: {
    box: Phaser.Physics.Arcade.Sprite;
    item: Phaser.GameObjects.Sprite;
  }[] = [];

  constructor() {
    super("game");
  }
  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  create() {
    const { width, height } = this.scale;
    this.player = this.physics.add
      .sprite(width / 2, height / 2.5, sokoban)
      .play(DOWN_WALK);
    this.player.body.setSize(
      this.player.width * 0.7,
      this.player.height * 0.75
    );
    this.player.setCollideWorldBounds(true);
    this.boxGroup = this.physics.add.staticGroup();
    this.itemsGround = this.add.group();
    this.createBoxes();
    this.physics.add.collider(
      this.player,
      this.boxGroup,
      this.handlePlayerBoxCollide,
      undefined,
      this
    );
    this.physics.world.setBounds(0, 0, width, height);
    const timerLabel = this.add
      .text(width * 0.5, 50, "45", { fontSize: "45px" })
      .setOrigin(0.5);
    this.countdown = new CountdownController(this, timerLabel);
    this.countdown.start(() => {});
  }
  createBoxes() {
    const { width } = this.scale;
    for (let i = 0; i < level.length; i++) {
      for (let j = 0; j < level[i].length; j++) {
        const box = this.boxGroup.create(
          width * 0.25 * (1 + i),
          150 * (1 + j),
          sokoban,
          10
        ) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
        box.body.setSize(64, 32);
        box.setData("itemType", level[i][j]);
        box.setData("isBlue", false);
      }
    }
  }
  handlePlayerBoxCollide: ArcadePhysicsCallback = (_player, _box) => {
    if (this.activeBox || _box.getData("isOpened")) return;
    const box = _box as Phaser.Physics.Arcade.Sprite;
    box.setFrame(9);
    this.activeBox = box;
  };
  updateBoxes() {
    if (!this.activeBox) return;
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.activeBox.x,
      this.activeBox.y
    );
    if (distance > 90 && !this.activeBox.getData("isBlue")) {
      this.activeBox.setFrame(10);
      this.activeBox = undefined;
    }
  }
  update() {
    this.updatePlayer();
    const { space } = this.cursors;
    this.children.each((_child) => {
      const child = _child as Phaser.Physics.Arcade.Sprite;
      const skip = child.getData("isImage") && child.scale > 0.8;
      if (skip) {
        return;
      }
      child.setDepth(child.y);
    });
    this.updateBoxes();
    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(space);
    if (spaceJustPressed && this.activeBox) {
      this.openBox(this.activeBox);
    }
    this.countdown?.update();
  }
  updatePlayer() {
    const { down, left, right, up } = this.cursors;
    const speed = 200;
    const prevAnimationDirection =
      this.player.anims.currentAnim.key.split("-")[0];
    const currentAnimation: { key: string; velocity: [number, number] } =
      down.isDown
        ? { key: DOWN_WALK, velocity: [0, speed] }
        : left.isDown
        ? { key: LEFT_WALK, velocity: [-speed, 0] }
        : right.isDown
        ? { key: RIGHT_WALK, velocity: [speed, 0] }
        : up.isDown
        ? { key: UP_WALK, velocity: [0, -speed] }
        : {
            key: `${prevAnimationDirection}-idle`,
            velocity: [0, 0],
          };
    this.player.play(currentAnimation.key, true);
    this.player.setVelocity(...currentAnimation.velocity);
  }
  openBox(box: Phaser.Physics.Arcade.Sprite) {
    if (box.getData("isOpened")) return;
    const itemType = box.getData("itemType") as number;
    const itemTexture = imageKeys[itemType];
    const item = this.itemsGround.get(
      box.x,
      box.y
    ) as Phaser.GameObjects.Sprite;
    item.setTexture(itemTexture);
    item.setScale(0).setAlpha(0);
    item.setData("isImage", true);
    box.setData("isOpened", true);
    item.setDepth(2000);
    this.handleBoxAnimation("open", {
      targets: item,
      onComplete: () => {
        if (item.texture.key === bear) {
          item.setTint(0xff0000);
          box.setData("isOpened", false);
          box.setFrame(7);
          this.handleBoxAnimation("close", {
            targets: item,
            onComplete() {},
          });
        } else {
          this.selectedBoxes.push({ box, item });
          if (this.selectedBoxes.length === 2) {
            this.checkForMatch();
          }
        }
      },
    });
  }
  checkForMatch() {
    const [first, second] = this.selectedBoxes;
    if (first.item.texture.key === second.item.texture.key) {
      this.time.delayedCall(1000, () => {
        this.selectedBoxes.forEach((i) => {
          // console.log("I'm runnig");
          i.box.setFrame(8).setData("isBlue", true);
        });
        // second.box.setFrame(8).setData("isBlue", true);
        ++this.matchCount;
        if (this.matchCount === 1) {
          const { width, height } = this.scale;
          this.add
            .text(width / 2, height / 2, "You Win", { fontSize: "30px" })
            .setOrigin(0.5);
        }
        this.selectedBoxes = [];
      });
    } else {
      this.closeSelectedBoxes();
    }
  }
  closeSelectedBoxes() {
    this.selectedBoxes.forEach((i) => {
      this.handleBoxAnimation("close", {
        targets: i.item,
        onComplete: () => {
          i.box.setData("isOpened", false);
        },
      });
    });

    this.selectedBoxes = [];
  }

  handleBoxAnimation(
    mode: "close" | "open",
    {
      targets,
      onComplete,
    }: Pick<Phaser.Types.Tweens.TweenBuilderConfig, "targets" | "onComplete">
  ) {
    const isOpen = mode === "open";
    this.tweens.add({
      targets,
      y: isOpen ? "-=50" : "+=0",
      alpha: isOpen ? 1 : 0,
      scale: isOpen ? 1 : 0,
      delay: isOpen ? 0 : 500,
      duration: 250,
      onComplete,
    });
  }
}

export default GameScene;
