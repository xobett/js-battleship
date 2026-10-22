import ChaplinAvatar from "../assets/icons/actor-chaplin-comedy-svgrepo-com.svg";
import AnimalAvatar from "../assets/icons/animal-avatar-mutton-svgrepo-com.svg";
import AnimeAvatar from "../assets/icons/anime-away-face-svgrepo-com.svg";
import HeinsenbergAvatar from "../assets/icons/avatar-bad-breaking-svgrepo-com.svg";
import BatmanAvatar from "../assets/icons/avatar-batman-comics-svgrepo-com.svg";
import CoffeeAvatar from "../assets/icons/avatar-coffee-cup-svgrepo-com.svg";
import SantaAvatar from "../assets/icons/christmas-clous-santa-svgrepo-com.svg";

const avatarIconSrcs = [
  ChaplinAvatar,
  AnimalAvatar,
  AnimeAvatar,
  HeinsenbergAvatar,
  BatmanAvatar,
  CoffeeAvatar,
  SantaAvatar,
];

export const getRandomAvatarIconSrc = () => {
  const randomIndex =
    Math.floor(Math.random() * (avatarIconSrcs.length - 1 - 0 + 1)) + 0;

  return avatarIconSrcs[randomIndex];
};
