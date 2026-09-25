import { PlayerController } from "../controllers/playerController.js";

export class Player {
  name = undefined;
  avatar = undefined;
  #controller = null;
  #isCPU = false;

  #score = 0;
  get Score() {
    return this.#score;
  }

  placeFleet() {
    if (this.#isCPU) {
      this.#controller.randomlyPlaceFleet();
    } else {
      this.#controller.placeFleet();
    }
  }

  attack(opponent) {
    if (this.#isCPU) {
      const randomAttackPos = opponent.getRandomAttackPos();
      return opponent.receiveAttack(randomAttackPos);
    } else {
      // await user input
      console.log("Waiting for user input");
    }
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

  constructor(name, isCPU = false) {
    if (name === undefined) throw new Error("Name is required");
    this.name = name;
    this.#isCPU = isCPU;
    this.#controller = new PlayerController();
  }
}
