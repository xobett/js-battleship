export class GameController {
  #players = [];
  #uiController;

  get players() {
    return this.#players;
  }
  constructor(uiController) {
    this.#uiController = uiController;
  }

  init() {
    this.#assignSceneHandlers();
  }

  #assignSceneHandlers() {
    this.#uiController.IntroScene.addEventListener("click", () => {
      this.#switchToMenu();
    });
    this.#uiController.MenuScene.addEventListener("click", () => {
      this.#switchToFleetPlacement();
    });
  }

  #switchToMenu() {
    this.#uiController.loadSceneById("menu-scene");
  }

  #switchToFleetPlacement() {
    this.#uiController.loadSceneById("fleet-placement-scene");
  }
}
