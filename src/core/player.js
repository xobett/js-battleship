import { PlayerController } from "../controllers/playerController.js";

export class Player {
  name = undefined;
  avatar = undefined;
  controller = null;

  #score = 0;
  get Score() {
    return this.#score;
  }

  constructor(name) {
    if (name === undefined) throw new Error("Name is required");
    this.name = name;
    this.controller = new PlayerController();
  }
}
