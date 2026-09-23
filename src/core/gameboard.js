import { Axis } from "../enums/axis.js";

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
        boardPos.assignShip(ship);
      }
    }

    ship.addEventListener("onHit", () => this.#assessFleetDamage());
    this.#ships.push(ship);
    return true;
  }

  randomlyPlaceShip(ship) {
    let placed = false;
    while (!placed) {
      const [randomX, randomY] = [this.#getRandomPos(), this.#getRandomPos()];
      const randomPos = [randomX, randomY];
      const randomAxis = this.#getRandomAxis();
      console.log(randomAxis);

      // TODO:
      // CHECK IF ITS CORRECTLY PLACING VERTICALLY OR HORIZONTALLY

      const result = this.placeShip(ship, randomPos, randomAxis);
      if (result) placed = true;
    }
  }

  #getRandomPos() {
    return Math.floor(Math.random() * (9 - 0 + 1)) + 0;
  }

  #getRandomAxis() {
    const random = this.#getRandomPos();
    return random % 2 == 0 ? Axis.horizontal : Axis.vertical;
  }

  receiveAttack(coordinates) {
    if (
      this.#attackedPositions.some((c) => this.#hasCoordinates(c, coordinates))
    )
      return;

    this.#attackedPositions.push(coordinates);
    console.log(...this.#attackedPositions.values());

    const [x, y] = coordinates;
    const pos = this.#positions[x][y];
    if (pos.ship === null) return false;

    pos.ship.hit();
    return true;
  }

  #hasCoordinates(c, coordinates) {
    return c[0] === coordinates[0] && c[1] === coordinates[1];
  }

  #isValidCoordinate(x) {
    return x >= 0 && x <= this.#size - 1;
  }

  printBoard() {
    for (let i = this.#positions.length - 1; i >= 0; i--) {
      const x = this.#positions[i];
      console.log(
        `Row ${i}  ${x.map((y) => (y.ship ? y.ship.name : " ")).join(",")} \n`,
      );
    }
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
