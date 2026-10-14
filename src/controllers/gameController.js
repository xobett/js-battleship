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
    this.#uiController.introScene.addEventListener("click", () => {
      this.#loadScene("menu-scene");
    });

    this.#uiController.menuReturnOptn.addEventListener("click", () => {
      this.#loadScene("intro-scene");
    });

    this.#uiController.menuContinueOptn.addEventListener("click", () => {
      this.#loadScene("fleet-placement-scene");
      this.#onEnterFleetPlacementScene();
    });

    this.#uiController.fleetReturnOptn.addEventListener("click", () => {
      this.#loadScene("menu-scene");
      this.#uiController.cleanBoardById("player-placement-board");
    });
  }

  #loadScene(scene) {
    this.#uiController.loadSceneById(scene);
  }

  #onEnterFleetPlacementScene() {
    this.#renderPlacingGameboard();
    this.#uiController.renderDraggableShips(this.#player1.fleet);
    this.#assignShipDragEventHandlers();
  }

  #renderPlacingGameboard() {
    const gameboardPositions = this.#player1.gameboardPositions;
    this.#uiController.renderPlayerBoard(
      "player-placement-board",
      gameboardPositions,
    );
  }

  #assignShipDragEventHandlers() {
    this.#uiController.playerGameboardPositions.forEach((p) => {
      p.addEventListener("pointerup", () => {
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        console.log(selectedShip.dataset.shipName);
        this.#uiController.clearSelectedShip();
      });

      p.addEventListener("pointerenter", (e) => {
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        const currCellData = e.target.dataset;

        const ship = this.#player1.ship(selectedShip.dataset.shipName);
        const coordinates = JSON.parse(currCellData.coordinates);
        const axis = selectedShip.dataset.axis;

        const canPlace = this.#player1.canPlaceShip(ship, coordinates, axis);
        this.#uiController.setDragValidity(canPlace);
      });
    });
  }
}
