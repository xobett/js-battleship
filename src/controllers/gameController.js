import { Player } from "../core/player.js";

export class GameController {
  #uiController;
  #player1 = undefined;
  #currentAxis = "vertical";

  constructor(uiController) {
    this.#uiController = uiController;
  }

  init() {
    this.#uiController.init();
    this.#configureNavigation();
    this.#configureFleetPlacementBtns();
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
      this.#uiController.clearBoardById("player-placement-board");
      this.#uiController.clearDraggableShips();
    });
  }

  #configureFleetPlacementBtns() {
    this.#uiController.rotateShipBtn.addEventListener("click", () => {
      this.#toggleCurrentRotation();
      this.#uiController.updateAxisDirection(this.#currentAxis);
    });
  }

  #toggleCurrentRotation() {
    if (this.#currentAxis === "vertical") this.#currentAxis = "horizontal";
    else this.#currentAxis = "vertical";
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
      p.addEventListener("pointerup", (e) => {
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        const currCellData = e.target.dataset;
        if (this.#player1.alreadyPlacedShip(selectedShip.name)) return;

        const ship = this.#player1.ship(selectedShip.name);
        const coordinates = JSON.parse(currCellData.coordinates);
        const axis = this.#currentAxis;

        const { canPlace, placingPath } = this.#player1.canPlaceShip(
          ship,
          coordinates,
          axis,
        );

        if (canPlace) {
          this.#player1.placeShip(ship, coordinates, axis);
          this.#uiController.renderPlacedPositions(ship, placingPath);
          this.#uiController.refreshAvailableShips(ship.name);
        }

        this.#uiController.clearSelectedShip();
      });

      p.addEventListener("pointerenter", (e) => {
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        const currCellData = e.target.dataset;
        if (this.#player1.alreadyPlacedShip(selectedShip.name)) return;

        const ship = this.#player1.ship(selectedShip.name);
        const coordinates = JSON.parse(currCellData.coordinates);
        const axis = this.#currentAxis;

        const { canPlace, placingPath } = this.#player1.canPlaceShip(
          ship,
          coordinates,
          axis,
        );
        this.#uiController.renderCanPlacePath(canPlace, placingPath);
      });

      p.addEventListener("pointerleave", () => {
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        this.#uiController.cleanDragVisuals();
      });
    });
  }
}
