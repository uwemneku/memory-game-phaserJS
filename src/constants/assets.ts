enum Assets {
  sokoban = "sokoban",
  bear = "bear",
  chicken = "chicken",
  duck = "duck",
  parrot = "parrot",
  penguin = "penguin",
}
export enum SceneKeys {
  preloader = "preloader",
  game = "game",
}

export enum SoundKeys {
  Music = "music",
  GameOver = "gameOver",
  Victory = "victory",
  Pick = "pick-up",
  Match = "match",
}

export const soundData = [
  { key: SoundKeys.GameOver, fileName: "GameOver.wav" },
  { key: SoundKeys.Pick, fileName: "Pickup-Soft.wav" },
  { key: SoundKeys.Victory, fileName: "Victory-SoundFX1.wav" },
  { key: SoundKeys.Match, fileName: "Ice-Reflect.wav" },
];
export const images: { img: string; name: string }[] = [
  { img: "bear.png", name: Assets.bear },
  { img: "chicken.png", name: Assets.chicken },
  { img: "duck.png", name: Assets.duck },
  { img: "parrot.png", name: Assets.parrot },
  { img: "penguin.png", name: Assets.penguin },
];
export const imageKeys = images.map((i) => i.name);
export const { sokoban, bear, chicken, duck, parrot, penguin } = Assets;
