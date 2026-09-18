export class Gameboard {
  #size = 10;
  #positions = [];
  #attackedPositions = [];
  #ships = [];

  constructor() {
    for (let i = 0; i < this.#size; i++) {
      const x = [];
      for (let j = 0; j < this.#size; j++) {
        x.push(j);
      }
      this.positions.push(new Position());
    }

    console.log(this.positions);
  }

  receiveAttack(coordinates) {
    if (this.#attackedPositions.includes(coordinates)) return;

    const [x, y] = coordinates;
    const pos = this.#positions[x][y];
  }
}

class Position {
  #ship = undefined;
  get Ship() {
    return this.#ship;
  }

  assignShip(ship) {
    this.#ship = ship;
  }
}
