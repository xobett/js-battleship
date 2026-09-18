export class Ship {
  #name = undefined;
  #length = undefined;
  #timesHit = 0;

  constructor(name, length) {
    if (name === undefined || length === undefined)
      throw new Error("Name and length are required");

    this.#name = name;
    this.#length = length;
  }

  get Name() {
    return this.#name;
  }
  get Length() {
    return this.#length;
  }
  get TimesHit() {
    return this.#timesHit;
  }

  hit() {
    this.#timesHit++;
  }

  isSunk() {
    return this.#timesHit >= this.#length;
  }
}
