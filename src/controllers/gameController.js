import { Player } from "../core/player.js";

export class GameController {
  #uiController;
  #player1 = undefined;

  constructor(uiController) {
    this.#uiController = uiController;
  }

  init() {
    this.#uiController.init();
    this.#configureNavigation();
    this.#player1 = new Player("Cesar");
  }

  #configureNavigation() {
    this.#uiController.IntroScene.addEventListener("click", () => {
      this.#loadScene("menu-scene");
    });

    this.#uiController.MenuReturnOptn.addEventListener("click", () => {
      this.#loadScene("intro-scene");
    });

    this.#uiController.MenuContinueOptn.addEventListener("click", () => {
      this.#loadScene("fleet-placement-scene");
      this.#onEnterFleetPlacementScene();
    });

    this.#uiController.FleetReturnOptn.addEventListener("click", () => {
      this.#loadScene("menu-scene");
      this.#uiController.cleanBoardById("player-placement-board");
    });
  }

  #loadScene(scene) {
    this.#uiController.loadSceneById(scene);
  }

  #onEnterFleetPlacementScene() {
    this.#renderPlacingGameboard();
    this.#assignFleetPlacementEventHandlers();
    this.#uiController.renderDraggableShips(this.#player1.fleet);
  }

  #renderPlacingGameboard() {
    const gameboardPositions = this.#player1.gameboardPositions;
    this.#uiController.renderPlayerBoard(
      "player-placement-board",
      gameboardPositions,
    );
  }

  #assignFleetPlacementEventHandlers() {
    this.#uiController.DomPositions.forEach((p) => {
      p.addEventListener("mouseenter", () => console.log("test"));
    });
  }
}
