enum Assets {
  sokoban = "sokoban",
  bear = "bear",
  chicken = "chicken",
  duck = "duck",
  parrot = "parrot",
  penguin = "penguin",
}
export const images: { img: string; name: string }[] = [
  { img: "bear.png", name: Assets.bear },
  { img: "chicken.png", name: Assets.chicken },
  { img: "duck.png", name: Assets.duck },
  { img: "parrot.png", name: Assets.parrot },
  { img: "penguin.png", name: Assets.penguin },
];
export const imageKeys = images.map((i) => i.name);
export const { sokoban, bear, chicken, duck, parrot, penguin } = Assets;
