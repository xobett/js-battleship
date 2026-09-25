import { Player } from "../core/player.js";
import { GameMode } from "../enums/gameMode.js";

export class GameController {
  #activePlayer = undefined;
  #player1 = undefined;
  #player2 = undefined;

  #winner = undefined;
  #gameOver = false;

  #players = [];
  get players() {
    return this.#players;
  }
  constructor() {}

  start(gameMode, player1, player2 = undefined) {
    const isCPU = gameMode === GameMode.pvp ? false : true;
    player2 = isCPU ? "CPU" : player2;

    this.#player1 = new Player(player1);
    this.#player2 = new Player(player2, isCPU);

    this.#startFleetSelection();
    this.play();
  }

  play() {
    this.#activePlayer = this.#player1;
    while (!this.#gameOver) {
      const opponent = this.#getOpponentPlayer();
      const hit = this.#activePlayer.attack(opponent);
      if (hit) {
        const defeated = this.#assessPossibleDefeat(opponent);
        if (defeated) {
          this.#winner = this.#activePlayer;
          this.#gameOver = true;
        }
      }
      this.#switchActivePlayer();
    }

    this.#announceWinner();
  }

  #assessPossibleDefeat(opponent) {
    if (opponent.fleetIsSunk()) return true;

    return false;
  }

  #announceWinner() {
    console.log(this.#winner.name + " is the winner!");
  }

  #getOpponentPlayer() {
    if (this.#activePlayer === this.#player1) return this.#player2;
    return this.#player1;
  }

  #switchActivePlayer() {
    if (this.#activePlayer === this.#player1) {
      this.#activePlayer = this.#player2;
    } else {
      this.#activePlayer = this.#player1;
    }
  }

  #startFleetSelection() {
    this.#player1.placeFleet();
    this.#player2.placeFleet();
  }
}
