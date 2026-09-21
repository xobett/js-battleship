import { Player } from "../core/player.js";
import { GameMode } from "../enums/gameMode.js";

export class GameController {
  #player1 = undefined;
  #player2 = undefined;

  constructor(gameMode) {
    switch (gameMode) {
      case GameMode.single:
        break;
      case GameMode.pvp:
        break;
      default:
        return;
    }
  }

  start() {
    this.#player1 = new Player("Cesar");
    this.#player2 = new Player("Abraham");
  }
}
