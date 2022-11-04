export default class Box {
  isActive: boolean = false;
  isOpen: boolean = false;
  isMatched: boolean = false;
  item: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  imageKey: number = 0;

  constructor(
    item: Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
    imageKey: number
  ) {
    this.item = item;
    this.imageKey = imageKey;
  }
  setActive(state: boolean) {
    this.isActive = state;
  }
  setOpen(state: boolean) {
    this.isOpen = state;
  }
  setMatched(state: boolean) {
    this.isMatched = state;
  }
}
