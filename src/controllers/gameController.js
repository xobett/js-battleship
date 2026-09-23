import { Player } from "../core/player.js";
import { GameMode } from "../enums/gameMode.js";

export class GameController {
  #player1 = undefined;
  #player2 = undefined;

  constructor() {}

  start(gameMode, player1, player2 = undefined) {
    const isCPU = gameMode === GameMode.pvp ? false : true;
    player2 = isCPU ? "CPU" : player2;

    this.#player1 = new Player(player1);
    this.#player2 = new Player(player2, isCPU);

    this.#startFleetSelection();
  }

  #startFleetSelection() {
    this.#player1.placeFleet();
    this.#player2.placeFleet();
  }
}
