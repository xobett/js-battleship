import { it, expect, describe } from "@jest/globals";
import { Gameboard } from "../core/gameboard";
import { Ship } from "../core/ship";
import { Axis } from "../enums/axis";

describe.skip("gameboard unit tests", () => {
  it("should return false when placing a ship on invalid x position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    const result = gameboard.placeShip(ship, [-1, 2], Axis.vertical);
    expect(result).toBe(false);
  });
  it("should return false when placing a ship on invalid y position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    const result = gameboard.placeShip(ship, [1, -2], Axis.vertical);
    expect(result).toBe(false);
  });
  it("should return false when placing a ship on invalid x & y position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    const result = gameboard.placeShip(ship, [-1, -2], Axis.vertical);
    expect(result).toBe(false);
  });
});

describe.skip("position tests on horizontal axis", () => {
  it("should return true when placing a ship on a valid position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    const result = gameboard.placeShip(ship, [0, 0], Axis.horizontal);
    expect(result).toBe(true);
  });
  it("should return false when placing a ship on a taken position 1", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.horizontal);
    const result = gameboard.placeShip(ship, [0, 0], Axis.horizontal);
    expect(result).toBe(false);
  });
  it("should return false when placing a ship on a taken position 2", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.horizontal);
    const result = gameboard.placeShip(ship, [1, 0], Axis.horizontal);
    expect(result).toBe(false);
  });
  it("should return true when placing a ship to the side of a taken position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.horizontal);
    const result = gameboard.placeShip(ship, [2, 0], Axis.horizontal);
    expect(result).toBe(true);
  });
});

describe.skip("position tests on vertical axis", () => {
  it("should return true when placing a ship on a valid position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    const result = gameboard.placeShip(ship, [0, 0], Axis.vertical);
    expect(result).toBe(true);
  });
  it("should return false when placing a ship on a taken position 1", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.vertical);
    const result = gameboard.placeShip(ship, [0, 0], Axis.horizontal);
    expect(result).toBe(false);
  });
  it("should return false when placing a ship on a taken position 2", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.vertical);
    const result = gameboard.placeShip(ship, [0, 1], Axis.horizontal);
    expect(result).toBe(false);
  });
  it("should return true when placing a ship to the side of a taken position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.vertical);
    const result = gameboard.placeShip(ship, [0, 2], Axis.vertical);
    expect(result).toBe(true);
  });
});

describe("attack tests", () => {
  it("should return true when attacking a position with ship 1", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.vertical);
    const result = gameboard.receiveAttack([0, 0]);
    expect(result).toBe(true);
  });
  it("should return true when attacking a position with ship 2", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.vertical);
    const result = gameboard.receiveAttack([0, 1]);
    expect(result).toBe(true);
  });
  it("should return false when attacking a position with no ship", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.vertical);
    const result = gameboard.receiveAttack([0, 2]);
    expect(result).toBe(false);
  });
  it("should return undefined when attacking an already attacked position", () => {
    const ship = new Ship("Destroyer", 2);
    const gameboard = new Gameboard();
    gameboard.placeShip(ship, [0, 0], Axis.vertical);
    gameboard.receiveAttack([0, 2]);
    const result = gameboard.receiveAttack([0, 2]);
    expect(result).toBe(undefined);
  });
});
