import { Gameboard } from "../core/gameboard.js";
import { FleetLoadouts } from "../core/fleetLoadouts.js";

export class PlayerController {
  #gameboard = undefined;
  get gameboard() {
    return this.#gameboard;
  }

  #fleet = undefined;
  get fleet() {
    return this.#fleet;
  }

  placeFleet() {
    this.#fleet.forEach((s) => {
      this.#gameboard.randomlyPlaceShip(s);
    });
    this.#gameboard.printBoard();
  }

  randomlyPlaceFleet() {
    this.#fleet.forEach((s) => {
      this.#gameboard.randomlyPlaceShip(s);
    });
    this.#gameboard.printBoard();
  }

  getRandomAttackPos() {
    return this.#gameboard.getRandomNonAttackedPos();
  }

  receiveAttack(coordinates) {
    return this.#gameboard.receiveAttack(coordinates);
  }

  constructor() {
    this.#gameboard = new Gameboard();
    this.#fleet = FleetLoadouts.starterFleet;
  }
}
