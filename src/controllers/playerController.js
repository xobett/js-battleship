import { Gameboard } from "../core/gameboard.js";
import { FleetLoadouts } from "../core/fleetLoadouts.js";

export class PlayerController {
  #gameboard = undefined;
  #fleet = undefined;

  constructor() {
    this.#gameboard = new Gameboard();
    this.#fleet = FleetLoadouts.starterFleet();
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

  alreadyPlacedShip(name) {
    return this.#gameboard.hasShip(name);
  }

  clearGameboard() {
    this.#gameboard.clear();
  }

  unsunkShips() {
    return this.#gameboard.unsunkShips();
  }

  canPlaceShip(ship, coordinates, axis) {
    return this.#gameboard.canPlaceShip(ship, coordinates, axis);
  }

  placeShip(ship, coordinates, axis) {
    this.#gameboard.placeShip(ship, coordinates, axis);
  }

  randomPlaceFleet() {
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
