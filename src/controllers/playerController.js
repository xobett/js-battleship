import { Gameboard } from "../core/gameboard.js";
import { FleetLoadouts } from "../core/fleetLoadouts.js";

export class PlayerController {
  gameboard = undefined;
  fleet = undefined;

  placeFleet() {
    this.fleet.forEach((s) => {
      this.gameboard.randomlyPlaceShip(s);
    });
    this.gameboard.printBoard();
  }

  randomlyPlaceFleet() {
    this.fleet.forEach((s) => {
      this.gameboard.randomlyPlaceShip(s);
    });
    this.gameboard.printBoard();
  }

  attack(pos) {
    this.gameboard.receiveAttack(pos);
  }

  constructor() {
    this.gameboard = new Gameboard();
    this.fleet = FleetLoadouts.starterFleet;
  }
}
