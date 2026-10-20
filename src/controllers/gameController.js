import { Player } from "../core/player.js";
import { Axis } from "../enums/axis.js";

export class GameController {
  #uiController;
  #player1 = undefined;
  #cpuPlayer = undefined;
  #currentAxis = Axis.vertical;
  #canAttack = true;

  constructor(uiController) {
    this.#uiController = uiController;
  }

  init() {
    this.#player1 = new Player("Cesar");
    this.#cpuPlayer = new Player("CPU");
    this.#uiController.init();
    this.#configureNavigation();
    this.#configureFleetPlacementBtns();
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
      this.#onReturnFromFleetPlacementScene();
    });

    this.#uiController.fleetContinueOptn.addEventListener("click", () => {
      this.#loadScene("gameplay-scene");
      this.#onEnterGameplayScene();
    });
  }

  #configureFleetPlacementBtns() {
    this.#uiController.rotateShipBtn.addEventListener("click", () => {
      this.#toggleCurrentRotation();
      this.#uiController.updateAxisDirection(this.#currentAxis);
    });

    this.#uiController.restartGameboardBtn.addEventListener("click", () => {
      this.#player1.clearGameboard();

      this.#uiController.clearBoardById("player-placement-board");
      this.#renderPlacingGameboard();
      this.#assignOnShipDropEventHandlers();
      this.#uiController.enableAllDraggableShips();

      this.#currentAxis = Axis.vertical;
    });
  }

  #toggleCurrentRotation() {
    if (this.#currentAxis === Axis.vertical)
      this.#currentAxis = Axis.horizontal;
    else this.#currentAxis = Axis.vertical;
  }

  #loadScene(scene) {
    this.#uiController.loadSceneById(scene);
  }

  #onEnterFleetPlacementScene() {
    this.#renderPlacingGameboard();
    this.#assignOnShipDropEventHandlers();
    this.#uiController.renderDraggableShips(this.#player1.fleet);
    this.#uiController.enableAllDraggableShips();
  }

  #onReturnFromFleetPlacementScene() {
    this.#player1.clearGameboard();

    this.#uiController.clearBoardById("player-placement-board");
    this.#uiController.clearDraggableShips();
    this.#currentAxis = Axis.vertical;
  }

  #onEnterGameplayScene() {
    this.#cpuPlayer.randomPlaceFleet();

    const playerGameboardPos = this.#player1.gameboardPositions;
    const cpuGameboardPos = this.#cpuPlayer.gameboardPositions;

    this.#uiController.renderGameplayGameboard(
      "player-board",
      playerGameboardPos,
      true,
    );
    this.#uiController.renderGameplayGameboard("cpu-board", cpuGameboardPos);

    this.#assignOnClickEnemyGameboardEventHandlers();
    this.#uiController.setCPUBoardDamageable(true);
    this.#updatePlayersShipCount();
  }

  #updatePlayersShipCount() {
    const playerShipsCountTotal = this.#player1.fleet.length.toString();
    const playerShipsCount = this.#player1.unsunkShips().toString();
    const cpuShipsCountTotal = this.#cpuPlayer.fleet.length.toString();
    const cpuShipsCount = this.#cpuPlayer.unsunkShips().toString();

    const playerTxt = `Remaining ships ${playerShipsCount} / ${playerShipsCountTotal}`;
    const cpuTxt = `Remaining ships ${cpuShipsCount} / ${cpuShipsCountTotal}`;

    this.#uiController.updateText("player-board-text", playerTxt);
    this.#uiController.updateText("cpu-board-text", cpuTxt);
  }

  #assignOnClickEnemyGameboardEventHandlers() {
    this.#uiController.cpuGameboardPositions.forEach((p) =>
      p.addEventListener("pointerup", async (e) => {
        if (!this.#canAttack) return;

        const currCell = e.target;
        const currCellData = e.target.dataset;

        const coordinates = JSON.parse(currCellData.coordinates);
        const hit = this.#cpuPlayer.receiveAttack(coordinates);
        if (hit === null) return;
        this.#uiController.onEnemyAttackedPos(hit, currCell);
        this.#updatePlayersShipCount();

        this.#canAttack = false;
        this.#uiController.setCPUBoardDamageable(false);
        await this.#receiveEnemyAttack();

        this.#canAttack = true;
        this.#uiController.setCPUBoardDamageable(true);
        this.#updatePlayersShipCount();
      }),
    );
  }

  #receiveEnemyAttack() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomCoordinates = this.#player1.getRandomAttackPos();
        const receivedHit = this.#player1.receiveAttack(randomCoordinates);
        this.#uiController.onPlayerAttackedPos(receivedHit, randomCoordinates);
        resolve();
      }, 1000);
    });
  }

  #renderPlacingGameboard() {
    const gameboardPositions = this.#player1.gameboardPositions;
    this.#uiController.renderGameboard(
      "player-placement-board",
      gameboardPositions,
    );
  }

  #assignOnShipDropEventHandlers() {
    this.#uiController.placementGameboardPositions.forEach((p) => {
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
          this.#uiController.disableDraggableShip(ship.name);
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
