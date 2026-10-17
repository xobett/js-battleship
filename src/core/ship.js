export class Ship extends EventTarget {
  #name = undefined;
  #size = undefined;
  #timesHit = 0;

  constructor(name, size, spriteSrc, color) {
    super();
    if (name === undefined || size === undefined)
      throw new Error("Name and size are required");

    this.#name = name;
    this.#size = size;
    this.color = color;
  }

  get name() {
    return this.#name;
  }
  get size() {
    return this.#size;
  }
  get timesHit() {
    return this.#timesHit;
  }

  hit() {
    this.#timesHit++;
  }

  isSunk() {
    return this.#timesHit >= this.#size;
  }
}
