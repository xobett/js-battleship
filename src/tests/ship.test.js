import { it, expect, describe } from "@jest/globals";
import { Ship } from "../core/ship";

describe.skip("ship unit tests", () => {
  it("creates a ship", () => {
    const ship = new Ship("Destroyer", 2);
    expect(ship.Name).toBe("Destroyer");
  });

  it("throws error if no arguments were given", () => {
    expect(() => {
      new Ship();
    }).toThrow("Name and length are required");
  });

  it("damages ship on hit", () => {
    const ship = new Ship("Destroyer", 3);
    ship.hit();
    expect(ship.TimesHit).toBe(1);
  });

  it("not sinks ship upon being hit less times than its length", () => {
    const ship = new Ship("Destroyer", 3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  it("sinks ship upon being hit more times than its length", () => {
    const ship = new Ship("Destroyer", 3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
