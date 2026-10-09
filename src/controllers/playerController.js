import { Gameboard } from "../core/gameboard.js";
import { FleetLoadouts } from "../core/fleetLoadouts.js";
import { GameController } from "./gameController.js";

export class PlayerController {
  #gameboard = undefined;
  get gameboard() {
    return this.#gameboard;
  }

  get gameboardPositions() {
    return this.#gameboard.positions;
  }

  #fleet = undefined;
  get fleet() {
    return this.#fleet;
  }

  placeFleet() {
    this.#fleet.forEach((s) => {
      const [pos, axis] = GameController.getPosAndInputAsync();
      this.#gameboard.placeShip(s, pos, axis);
    });
  }

  randomlyPlaceFleet() {
    this.#fleet.forEach((s) => {
      this.#gameboard.randomlyPlaceShip(s);
    });
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
