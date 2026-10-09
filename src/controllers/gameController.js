import { Player } from "../core/player.js";

export class GameController {
  #uiController;
  #player1 = undefined;

  constructor(uiController) {
    this.#uiController = uiController;
  }

  init() {
    this.#assignSceneHandlers();
    this.#player1 = new Player("Cesar");
  }

  #assignSceneHandlers() {
    this.#uiController.IntroScene.addEventListener("click", () => {
      this.#loadScene("menu-scene");
    });

    this.#uiController.MenuReturnOptn.addEventListener("click", () => {
      this.#loadScene("intro-scene");
    });

    this.#uiController.MenuContinueOptn.addEventListener("click", () => {
      this.#loadScene("fleet-placement-scene");
      this.#renderFleetPlacement();
    });

    this.#uiController.FleetReturnOptn.addEventListener("click", () => {
      this.#loadScene("menu-scene");
      this.#uiController.cleanBoardById("player-placement-board");
    });
  }

  #loadScene(scene) {
    this.#uiController.loadSceneById(scene);
  }
  #renderFleetPlacement() {
    const gameboardPositions = this.#player1.GameboardPositions;
    this.#uiController.renderPlayerBoard(
      "player-placement-board",
      gameboardPositions,
    );
  }
}
