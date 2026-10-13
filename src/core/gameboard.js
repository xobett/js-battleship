import { Axis } from "../enums/axis.js";

export class Gameboard {
  #size = 10;
  #positions = [];
  #attackedPositions = [];
  #ships = [];

  constructor() {
    this.#buildBoard();
  }

  get positions() {
    return this.#positions;
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

  entireFleetIsSunk() {
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

  canPlaceShip(ship, coordinates, axis) {
    const [x, y] = coordinates;
    if (!this.#isValidCoordinate(x) || !this.#isValidCoordinate(y))
      return false;

    const [endX, endY] = [
      x + (axis === Axis.vertical ? ship.size - 1 : 0),
      y + (axis === Axis.horizontal ? ship.size - 1 : 0),
    ];

    if (!this.#isValidCoordinate(endX) || !this.#isValidCoordinate(endY)) {
      console.log(
        `Coordinates given ${coordinates}, size of ship ${ship.size}, axis ${axis}`,
      );
      console.log("invalid x: " + endX);
      console.log("invalid y: " + endY);
      return false;
    }

    let collisionedWithExisting = false;
    if (axis === Axis.horizontal) {
      for (let i = x; i <= endX; i++) {
        const boardPos = this.#positions[i][y];
        if (boardPos.ship !== null) {
          console.log("collisions with " + ship.name);
          collisionedWithExisting = true;
          break;
        }
      }
    } else {
      for (let i = y; i <= endY; i++) {
        const boardPos = this.#positions[x][i];
        if (boardPos.ship !== null) {
          console.log("vertical collisions with " + ship.name);
          collisionedWithExisting = true;
          break;
        }
      }
    }

    if (collisionedWithExisting) return false;

    return true;
  }

  placeShip(ship, coordinates, axis) {
    const [x, y] = coordinates;
    if (!this.#isValidCoordinate(x) || !this.#isValidCoordinate(y))
      return false;

    const [endX, endY] = [
      x + (axis === Axis.horizontal ? ship.size - 1 : 0),
      y + (axis === Axis.vertical ? ship.size - 1 : 0),
    ];

    if (!this.#isValidCoordinate(endX) || !this.#isValidCoordinate(endY))
      return false;

    let collisionedWithExisting = false;
    if (axis === Axis.horizontal) {
      for (let i = x; i <= endX; i++) {
        const boardPos = this.#positions[i][y];
        if (boardPos.ship !== null) {
          collisionedWithExisting = true;
          break;
        }
      }
    } else {
      for (let i = y; i <= endY; i++) {
        const boardPos = this.#positions[x][i];
        if (boardPos.ship !== null) {
          collisionedWithExisting = true;
          break;
        }
      }
    }

    if (collisionedWithExisting) return false;

    if (axis === Axis.horizontal) {
      for (let i = x; i <= endX; i++) {
        const boardPos = this.#positions[i][y];
        boardPos.assignShip(ship);
      }
    } else {
      for (let i = y; i <= endY; i++) {
        const boardPos = this.#positions[x][i];
        boardPos.assignShip(ship);
      }
    }

    this.#ships.push(ship);
    return true;
  }

  randomlyPlaceShip(ship) {
    let placed = false;
    while (!placed) {
      const [randomX, randomY] = [this.#getRandomPos(), this.#getRandomPos()];
      const randomPos = [randomX, randomY];
      const randomAxis = this.#getRandomAxis();

      const result = this.placeShip(ship, randomPos, randomAxis);
      if (result) placed = true;
    }
  }

  getRandomNonAttackedPos() {
    let nonAttackedPos = undefined;

    while (nonAttackedPos === undefined) {
      const [randomX, randomY] = [this.#getRandomPos(), this.#getRandomPos()];
      const randomPos = [randomX, randomY];
      if (
        !this.#attackedPositions.some((c) => this.#hasCoordinates(c, randomPos))
      ) {
        nonAttackedPos = randomPos;
      }
    }

    return nonAttackedPos;
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
  isShipStartingPlacedPos = undefined;
  #ship = null;
  get ship() {
    return this.#ship;
  }

  assignShip(ship, isShipStartingPlacedPos = false) {
    this.#ship = ship;
    this.isShipStartingPlacedPos = isShipStartingPlacedPos;
  }
}
