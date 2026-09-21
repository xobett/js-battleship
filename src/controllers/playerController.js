import { Gameboard } from "../core/gameboard.js";
import { FleetLoadouts } from "../core/fleetLoadouts.js";

export class PlayerController {
  gameboard = undefined;
  fleet = undefined;

  placeFleet() {}

  attack(pos) {
    this.gameboard.receiveAttack(pos);
  }

  constructor() {
    this.gameboard = new Gameboard();
    this.fleet = FleetLoadouts.starterFleet;
  }
}
