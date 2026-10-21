import { Axis } from "../enums/axis.js";

export class Gameboard {
  #size = 10;
  #positions = [];
  #attackedPositions = [];
  #ships = [];

  constructor() {
    this.#buildBoard();
  }

  unsunkShips() {
    let count = 0;
    this.#ships.forEach((s) => {
      if (!s.isSunk()) count++;
    });

    return count;
  }

  get positions() {
    return this.#positions;
  }

  hasShip(name) {
    return this.#ships.some((ship) => ship.name === name);
  }

  #buildBoard() {
    for (let i = 0; i < this.#size; i++) {
      const row = [];
      for (let j = 0; j < this.#size; j++) {
        row.push(new Position());
      }
      this.#positions.push(row);
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

  clear() {
    this.#positions = [];
    this.#ships = [];
    this.#buildBoard();
  }

  canPlaceShip(ship, coordinates, axis) {
    const [row, column] = coordinates;
    const [endRow, endColumn] = [
      row + (axis === Axis.vertical ? ship.size - 1 : 0),
      column + (axis === Axis.horizontal ? ship.size - 1 : 0),
    ];

    let placingPath = [];
    if (axis === Axis.vertical) {
      for (let i = row; i <= endRow; i++) {
        if (!this.#isValidCoordinate(i)) break;
        placingPath.push([i, column]);
      }
    } else {
      for (let i = column; i <= endColumn; i++) {
        if (!this.#isValidCoordinate(i)) break;
        placingPath.push([row, i]);
      }
    }

    if (
      !this.#isValidCoordinate(row) ||
      !this.#isValidCoordinate(column) ||
      !this.#isValidCoordinate(endRow) ||
      !this.#isValidCoordinate(endColumn)
    ) {
      return { canPlace: false, placingPath };
    }

    let collisionedWithExisting = false;
    if (axis === Axis.vertical) {
      for (let i = row; i <= endRow; i++) {
        const boardPos = this.#positions[i][column];
        if (boardPos.ship !== null) {
          collisionedWithExisting = true;
          break;
        }
      }
    } else {
      for (let i = column; i <= endColumn; i++) {
        const boardPos = this.#positions[row][i];
        if (boardPos.ship !== null) {
          collisionedWithExisting = true;
          break;
        }
      }
    }

    if (collisionedWithExisting) {
      return { canPlace: false, placingPath };
    }

    return { canPlace: true, placingPath };
  }

  placeShip(ship, coordinates, axis) {
    const [row, column] = coordinates;
    const [endRow, endColumn] = [
      row + (axis === Axis.vertical ? ship.size - 1 : 0),
      column + (axis === Axis.horizontal ? ship.size - 1 : 0),
    ];

    if (axis === Axis.vertical) {
      for (let i = row; i <= endRow; i++) {
        const boardPos = this.#positions[i][column];
        boardPos.assignShip(ship);
      }
    } else {
      for (let i = column; i <= endColumn; i++) {
        const boardPos = this.#positions[row][i];
        boardPos.assignShip(ship);
      }
    }

    this.#ships.push(ship);
  }

  randomlyPlaceShip(ship) {
    let placed = false;
    while (!placed) {
      const [randomRow, randomColumn] = [
        this.#getRandomPos(),
        this.#getRandomPos(),
      ];
      const randomPos = [randomRow, randomColumn];
      const randomAxis = this.#getRandomAxis();

      const { canPlace } = this.canPlaceShip(ship, randomPos, randomAxis);
      if (canPlace) {
        this.placeShip(ship, randomPos, randomAxis);
        placed = true;
      }
    }
  }

  getRandomNonAttackedPos() {
    let nonAttackedPos = undefined;

    while (nonAttackedPos === undefined) {
      const [randomRow, randomColumn] = [
        this.#getRandomPos(),
        this.#getRandomPos(),
      ];
      const randomPos = [randomRow, randomColumn];
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
      return { hit: false };

    this.#attackedPositions.push(coordinates);

    const [row, column] = coordinates;
    const pos = this.#positions[row][column];
    if (pos.ship === null) return false;

    pos.ship.hit();

    const koHit = pos.ship.isSunk();

    return { hit: true, koHit };
  }

  #hasCoordinates(c, coordinates) {
    return c[0] === coordinates[0] && c[1] === coordinates[1];
  }

  #isValidCoordinate(x) {
    return x >= 0 && x <= this.#size - 1;
  }

  printBoard() {
    for (let i = this.#positions.length - 1; i >= 0; i--) {
      const row = this.#positions[i];
      console.log(
        `Row ${i}  ${row.map((column) => (column.ship ? column.ship.name : " ")).join(",")} \n`,
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
