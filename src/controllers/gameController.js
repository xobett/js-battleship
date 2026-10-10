import { Player } from "../core/player.js";

export class GameController {
  #uiController;
  #player1 = undefined;
  #selectedSprite = undefined;

  constructor(uiController) {
    this.#uiController = uiController;
  }

  init() {
    this.#configureNavigation();
    this.#player1 = new Player("Cesar");

    document.addEventListener("mousemove", (e) => {
      console.log(this.#selectedSprite);
      if (this.#selectedSprite === undefined) return;
      this.#selectedSprite.style.position = "absolute";
      this.#selectedSprite.style.top = e.clientY + "px";
      this.#selectedSprite.style.left = e.clientX + "px";
    });
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
    this.renderPlaceableShips();
    this.#assignFleetPlacementEventHandlers();
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
      p.addEventListener("click", () => console.log("test"));
    });
  }

  renderPlaceableShips() {
    for (let i = 0; i < this.#uiController.ShipContainers.length; i++) {
      const domContainer = this.#uiController.ShipContainers[i];
      const currShip = this.#player1.fleet[i];
      const img = document.createElement("img");
      img.src = currShip.spriteSrc;
      domContainer.append(img);

      img.dataset.selected = false;
      img.dataset.shipName = currShip.name;
      img.style.pointerEvents = "none";

      domContainer.addEventListener("pointerdown", (e) => {
        const img = e.target.firstChild;
        const clone = img.cloneNode();
        document.body.append(clone);
        this.#selectedSprite = clone;
        console.log(this.#selectedSprite);
      });
    }
  }
}
