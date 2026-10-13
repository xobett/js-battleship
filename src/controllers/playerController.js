import { Gameboard } from "../core/gameboard.js";
import { FleetLoadouts } from "../core/fleetLoadouts.js";
import { GameController } from "./gameController.js";

export class PlayerController {
  #gameboard = undefined;
  #fleet = undefined;

  constructor() {
    this.#gameboard = new Gameboard();
    this.#fleet = FleetLoadouts.starterFleet;
  }

  get gameboard() {
    return this.#gameboard;
  }

  get gameboardPositions() {
    return this.#gameboard.positions;
  }

  get fleet() {
    return this.#fleet;
  }

  canPlaceShip(ship, coordinates, axis) {
    return this.#gameboard.canPlaceShip(ship, coordinates, axis);
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
}
