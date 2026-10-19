import { PlayerController } from "../controllers/playerController.js";

export class Player {
  name = undefined;
  avatar = undefined;
  #controller = null;

  constructor(name) {
    if (name === undefined) throw new Error("Name is required");
    this.name = name;
    this.#controller = new PlayerController();
  }

  get fleet() {
    return this.#controller.fleet;
  }

  randomPlaceFleet() {
    this.#controller.randomPlaceFleet();
  }

  getRandomAttackPos() {
    return this.#controller.getRandomAttackPos();
  }

  receiveAttack(coordinates) {
    return this.#controller.receiveAttack(coordinates);
  }

  fleetIsSunk() {
    return this.#controller.gameboard.entireFleetIsSunk();
  }

  alreadyPlacedShip(name) {
    return this.#controller.alreadyPlacedShip(name);
  }

  clearGameboard() {
    this.#controller.clearGameboard();
  }

  canPlaceShip(ship, coordinates, axis) {
    return this.#controller.canPlaceShip(ship, coordinates, axis);
  }

  placeShip(ship, coordinates, axis) {
    this.#controller.placeShip(ship, coordinates, axis);
  }

  ship(name) {
    for (let i = 0; i < this.fleet.length; i++) {
      const currShip = this.fleet[i];
      if (currShip.name === name) {
        return currShip;
      }
    }

    return undefined;
  }

  get gameboardPositions() {
    return this.#controller.gameboardPositions;
  }
}
