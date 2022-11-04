import Phaser from "phaser";
import Box from "./box";
import Player from "./player";

const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2],
];

class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Player;
  boxGroup!: Phaser.Physics.Arcade.StaticGroup;
  activeBox: Box | undefined;
  selectedBoxes: Box[] = [];

  constructor() {
    super("game");
    this.activeBox = undefined;
  }

  create() {
    this.boxGroup = this.physics.add.staticGroup();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = new Player(this.physics.add, this.scale);
    this.createBoxes();
    this.physics.add.collider(
      this.player.getPlayer(),
      this.boxGroup,
      this.handlePlayerBoxCollider
    );
  }
  checkMatch() {
    const [first, second] = this.selectedBoxes;
    const matches = first.imageKey === second.imageKey;
    if (matches) {
      first.setIsMatched(true);
      second.setIsMatched(true);
    } else {
      first.close(() => {});
      second.close(() => {});
    }
    this.selectedBoxes = [];
  }
  handlePlayerBoxCollider: ArcadePhysicsCallback = (_player, _box) => {
    const box = _box as Box;
    if (this.activeBox || box.isActive) return;
    box.setIsActive(true);
    this.setActiveBox(box);
  };
  update() {
    this.sortDepth();
    this.player.update(this.cursors, this.handlePlayerMove.bind(this));

    if (this.selectedBoxes.length === 2) return;

    const SpaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space);
    if (SpaceJustPressed && this.activeBox) {
      const _box = this.activeBox;
      _box.open(() => {
        this.selectedBoxes.push(_box);
        if (this.selectedBoxes.length === 2) {
          this.checkMatch();
        }
      });
    }
  }
  setActiveBox(box?: typeof this.activeBox) {
    this.activeBox = box;
  }
  handlePlayerMove(x: number, y: number) {
    if (this.activeBox) {
      const playerDistanceFromBox = Phaser.Math.Distance.Between(
        x,
        y,
        this.activeBox.x,
        this.activeBox.y
      );
      if (playerDistanceFromBox > 60 && !this.activeBox.isMatched) {
        this.activeBox.setIsActive(false);
        this.setActiveBox(undefined);
      }
    }
  }
  createBoxes() {
    const { width } = this.scale;
    level.forEach((arr, row) => {
      arr.forEach((index, col) => {
        const a = new Box(
          this,
          width * 0.25 * (row + 1),
          150 * (col + 1),
          index
        );
        this.boxGroup.add(a);
        a.body.setSize(64, 32);
      });
    });
  }
  sortDepth() {
    this.children.each((_child) => {
      const child = _child as Phaser.Physics.Arcade.Sprite;
      const skipDepthSort = !["Graphics", "Image"].includes(child.type);
      if (skipDepthSort) {
        child.setDepth(child.y);
      }
    });
  }
}

export default GameScene;
