import { tweenMusic } from "./MusicUtils";
import { SceneKeys, SoundKeys } from "./../constants/assets";
import Phaser from "phaser";
import Box from "./box";
import Modal from "./Modal";
import CountdownController from "./countdownController";

const level = [
  [4, 0, 3],
  [2, 4, 1],
  [3, 1, 2],
];

class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  boxGroup!: Phaser.Physics.Arcade.StaticGroup;
  activeBox: Box | undefined;
  selectedBoxes: Box[] = [];
  music!: Phaser.Sound.BaseSound;
  modal!: Modal;
  matchCount = 0;
  startKey!: Phaser.Input.Keyboard.Key;
  timer!: CountdownController;

  constructor() {
    super(SceneKeys.game);
    this.activeBox = undefined;
  }
  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.music = this.sound.add(SoundKeys.Music, { loop: true, volume: 0 });
    this.startKey = this.input.keyboard.addKey("A");
    this.music.play();
    tweenMusic(this, this.music, 0.3);
  }

  create() {
    const modal = new Modal(this);
    const { width } = this.scale;
    this.boxGroup = this.physics.add.staticGroup();
    const timerLabel = this.add
      .text(width * 0.5, 50, "Timer", { fontSize: "32px" })
      .setOrigin(0.5);
    this.timer = new CountdownController(this, timerLabel).start(45000, () => {
      tweenMusic(this, this.music, 0);
      this.addText("You Lost");
      this.sound.play(SoundKeys.GameOver);
    });
    // this.createBoxes();
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
      this.cameras.main.shake(250, 0.005, true);
      this.selectedBoxes.map((i) => {
        i.close(() => {
          this.selectedBoxes = [];
        });
      });
    }
  }
  handleGameWon() {
    if (this.matchCount === 4) {
      tweenMusic(this, this.music, 0);
      this.timer.stop();
      this.sound.play(SoundKeys.Victory);
      this.addText("You Won");
    }
  }

  update() {
    this.timer.update();
  }
  setActiveBox(box?: typeof this.activeBox) {
    this.activeBox = box;
  }

  createBoxes() {
    const { width } = this.scale;
    level.forEach((arr, row) => {
      arr.forEach((index, col) => {
        const _box = new Box(
          this,
          width * 0.25 * (row + 1),
          150 * (col + 1),
          index
        );
        _box.setInteractive().on("pointerdown", () => {
          if (this.selectedBoxes.length === 2) return;
          this.selectedBoxes.push(_box);
          _box.open(() => {
            if (this.selectedBoxes.length === 2) {
              this.checkMatch();
            }
          });
        });
        this.boxGroup.add(_box); // this is called first to give the box a ```setSize``` property
        _box.body.setSize(64, 32);
      });
    });
  }

  addText(text: string) {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, text, { fontSize: "40px" })
      .setOrigin(0.5)
      .setDepth(10000);
  }
}

export default GameScene;
