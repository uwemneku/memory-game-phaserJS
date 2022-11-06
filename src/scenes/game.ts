import { tweenMusic } from "./MusicUtils";
import { SceneKeys, SoundKeys } from "./../constants/assets";
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
  music!: Phaser.Sound.BaseSound;
  matchCount = 0;

  constructor() {
    super(SceneKeys.game);
    this.activeBox = undefined;
  }
  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    const l = this.sound.add(SoundKeys.Music, { loop: true, volume: 0 });
    l.play();
    tweenMusic(this, l, 0.5);
  }

  create() {
    this.boxGroup = this.physics.add.staticGroup();
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
      this.sound.play(SoundKeys.Match);
      this.matchCount++;
      this.selectedBoxes = [];
      this.handleGameWon();
    } else {
      this.sound.play(SoundKeys.GameOver);
      this.selectedBoxes.map((i) => {
        i.close(() => {
          this.selectedBoxes = [];
        });
      });
    }
  }
  handleGameWon() {
    if (this.matchCount === 4) {
      this.sound.play(SoundKeys.Victory);
      this.addText("You Won");
    }
  }
  handlePlayerBoxCollider: ArcadePhysicsCallback = (_player, _box) => {
    const box = _box as Box;
    if (this.activeBox || box.isActive || box.isMatched) return;
    box.setIsActive(true);
    this.setActiveBox(box);
  };
  update() {
    this.sortDepth();
    this.player.update(this.cursors, this.handlePlayerMove.bind(this));

    const SpaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space);
    if (SpaceJustPressed && this.activeBox) {
      const _box = this.activeBox;
      if (this.selectedBoxes.length === 2) return;
      this.selectedBoxes.push(_box);
      this.sound.play(SoundKeys.Pick);
      _box.open(() => {
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
      if (playerDistanceFromBox > 60) {
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
        this.boxGroup.add(a); // this is called first to give the box a ```setSize``` property
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
  addText(text: string) {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, text, { fontSize: "40px" })
      .setOrigin(0.5);
  }
}

export default GameScene;
