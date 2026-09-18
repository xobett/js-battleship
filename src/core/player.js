class Player {
  name = undefined;
  avatar = undefined;

  #score = 0;
  get Score() {
    return this.#score;
  }

  constructor(name) {
    this.name = name;
  }
}
