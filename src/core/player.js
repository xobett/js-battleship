import { PlayerController } from "../controllers/playerController.js";

export class Player {
  name = undefined;
  avatar = undefined;
  controller = null;
  #isCPU = false;

  #score = 0;
  get Score() {
    return this.#score;
  }

  placeFleet() {
    if (this.#isCPU) {
      this.controller.randomlyPlaceFleet();
    } else {
      this.controller.placeFleet();
    }
  }

  constructor(name, isCPU = false) {
    if (name === undefined) throw new Error("Name is required");
    this.name = name;
    this.#isCPU = isCPU;
    this.controller = new PlayerController();
  }
}
