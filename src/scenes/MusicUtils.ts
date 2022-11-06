import Phaser from "phaser";
export const tweenMusic = (
  scene: Phaser.Scene,
  music: Phaser.Sound.BaseSound,
  volume: number
) => {
  scene.add.tween({
    targets: music,
    volume,
    duration: 1000,
  });
};
