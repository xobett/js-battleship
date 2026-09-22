import { Axis } from "../enums/axis";

export class Gameboard {
  #size = 10;
  #positions = [];
  #attackedPositions = [];
  #ships = [];

  constructor() {
    this.#buildBoard();
  }

  #buildBoard() {
    for (let i = 0; i < this.#size; i++) {
      const x = [];
      for (let j = 0; j < this.#size; j++) {
        x.push(new Position());
      }
      this.#positions.push(x);
    }
  }

  #assessFleetDamage() {
    let allSunk = true;
    for (let i = 0; i < this.#ships.length; i++) {
      const ship = this.#ships[i];
      if (!ship.isSunk()) {
        allSunk = false;
        break;
      }
    }

    return allSunk;
  }

  placeShip(ship, pos, axis) {
    const [x, y] = pos;
    if (!this.#isValidCoordinate(x) || !this.#isValidCoordinate(y))
      return false;

    const [endX, endY] = [
      x + (axis === Axis.horizontal ? ship.size : 0),
      y + (axis === Axis.vertical ? ship.size : 0),
    ];

    if (!this.#isValidCoordinate(endX) || !this.#isValidCoordinate(endY))
      return false;

    let collisionedWithExisting = false;
    if (axis === Axis.horizontal) {
      for (let i = x; i < endX; i++) {
        const boardPos = this.#positions[i][y];
        if (boardPos.ship !== null) {
          collisionedWithExisting = true;
          break;
        }
      }
    } else {
      for (let i = y; i < endY; i++) {
        const boardPos = this.#positions[x][i];
        if (boardPos.ship !== null) {
          collisionedWithExisting = true;
          break;
        }
      }
    }

    if (collisionedWithExisting) return false;

    if (axis === Axis.horizontal) {
      for (let i = x; i < endX; i++) {
        const boardPos = this.#positions[i][y];
        boardPos.assignShip(ship);
      }
    } else {
      for (let i = y; i < endY; i++) {
        const boardPos = this.#positions[x][i];
        boardPos.assignShip(y);
      }
    }

    ship.addEventListener("onHit", () => this.#assessFleetDamage());
    this.#ships.push(ship);
    return true;
  }

  receiveAttack(coordinates) {
    if (this.#attackedPositions.includes(coordinates)) return;
    this.#attackedPositions.push(coordinates);

    const [x, y] = coordinates;
    const pos = this.#positions[x][y];
    if (pos.ship === null) return false;

    pos.ship.hit();
    return true;
  }

  #isValidCoordinate(x) {
    return x >= 0 && x <= this.#size - 1;
  }
}

class Position {
  #ship = null;
  get ship() {
    return this.#ship;
  }

  assignShip(ship) {
    this.#ship = ship;
  }
}
