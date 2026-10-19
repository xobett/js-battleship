import "../css/bg-waves.css";
import "../css/header.css";
import "../css/main.css";
import "../css/dragging-ship-dot.css";
import "../css//scenes/intro.css";
import "../css//scenes/menu.css";
import "../css/scenes/gameplay.css";
import "../css/scenes/fleet-placement.css";
import { Axis } from "../enums/axis.js";

export class UiController {
  #gameScenes = [];
  #selectedShip = undefined;

  #canDrag = false;
  #validDragClass = "validDrag";
  #invalidDragClass = "invalidDrag";
  #currentValidClass = undefined;

  #followableIcons = [];

  constructor() {}

  get selectedShip() {
    return this.#selectedShip;
  }

  get introScene() {
    return document.getElementById("intro-scene");
  }

  get menuContinueOptn() {
    return document.getElementById("menu-continue-optn");
  }
  get menuReturnOptn() {
    return document.getElementById("menu-return-optn");
  }

  get fleetContinueOptn() {
    return document.getElementById("fleet-continue-optn");
  }
  get fleetReturnOptn() {
    return document.getElementById("fleet-return-optn");
  }

  get playerGameboardPositions() {
    return document.querySelectorAll(".position");
  }
  get shipContainers() {
    return document.querySelectorAll(".fleet-container .ship");
  }

  get rotateShipBtn() {
    return document.getElementById("rotate-ship-btn");
  }
  get randomPlaceShipBtn() {
    return document.getElementById("random-place-ship-btn");
  }

  init() {
    this.#onInitConfigure();
  }

  #onInitConfigure() {
    this.#gameScenes = document.querySelectorAll(".game-scene");
    this.#configureDrag();
    this.#configureCursorFollow();
  }

  #configureCursorFollow() {
    document.addEventListener("mousemove", (e) => {
      const y = e.clientY;
      const x = e.clientX;
      this.#followableIcons.forEach((i) => {
        i.style.top = `${y}px`;
        i.style.left = `${x}px`;
      });
    });
  }

  #configureDrag() {
    document.addEventListener("pointermove", () => {
      if (this.#selectedShip === undefined) return;

      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    });

    document.addEventListener("pointerup", () => {
      this.cleanDragVisuals();

      document.body.style.userSelect = "initial";
      document.body.style.cursor = "initial";

      if (this.#selectedShip !== undefined) this.clearSelectedShip();
    });
  }

  loadSceneById(sceneId) {
    this.#gameScenes.forEach((scene) => scene.classList.remove("active"));
    try {
      const scene = document.getElementById(sceneId);
      scene.classList.add("active");
    } catch {
      console.error(`No element with the id of ${sceneId} exists`);
    }
  }

  renderPlayerBoard(selector, gameboardPositions) {
    try {
      const domBoard = document.getElementById(selector);

      for (let x = gameboardPositions.length - 1; x >= 0; x--) {
        const currX = gameboardPositions[x];
        for (let y = 0; y < currX.length; y++) {
          const pos = document.createElement("div");
          pos.classList.add("position");
          pos.dataset.coordinates = `[${x},${y}]`;
          domBoard.append(pos);
        }
      }
    } catch (e) {
      console.error(e);
      console.error(`No element with the id of ${selector} exists`);
    }
  }

  clearBoardById(id) {
    try {
      const board = document.getElementById(id);
      board.replaceChildren();
    } catch {
      console.error(`No element with the id of ${id} exists`);
    }
  }

  renderDraggableShips(playerFleet) {
    for (let i = 0; i < this.shipContainers.length; i++) {
      const currContainer = this.shipContainers[i];
      const currShip = playerFleet[i];

      currContainer.dataset.placed = false;
      currContainer.dataset.shipName = currShip.name;

      const shipVisual = document.createElement("div");
      shipVisual.dataset.ship = currShip.name
        .toString()
        .toLowerCase()
        .replace(/\s/g, "");
      shipVisual.classList.add("dragging-ship-dot", "static");

      const shipNameText = document.createElement("span");
      shipNameText.textContent = currShip.name;

      currContainer.append(shipVisual, shipNameText);

      currContainer.addEventListener("pointerdown", (e) => {
        this.#selectedShip = currShip;

        for (let i = 0; i < currShip.size; i++) {
          const x = e.clientX;
          const y = e.clientY;

          const draggingShipDot = document.createElement("div");
          draggingShipDot.classList.add("dragging-ship-dot");

          draggingShipDot.style.transitionDelay = `${Number(i * 0.001)}s`;
          draggingShipDot.style.animationDelay = `${Number(i * 0.1)}s`;
          draggingShipDot.style.top = `${y}px`;
          draggingShipDot.style.left = `${x}px`;

          draggingShipDot.dataset.ship = currShip.name
            .toString()
            .toLowerCase()
            .replace(/\s/g, "");

          this.#followableIcons.push(draggingShipDot);
          document.body.append(draggingShipDot);
        }
      });
    }
  }

  clearDraggableShips() {
    this.shipContainers.forEach((sC) => sC.replaceChildren());
  }

  clearSelectedShip() {
    this.#selectedShip = undefined;
    this.#followableIcons.forEach((i) => i.remove());
    this.#followableIcons = [];
  }

  renderCanPlacePath(canPlace, placingPath) {
    this.cleanDragVisuals();
    this.#canDrag = canPlace;

    if (this.#canDrag) {
      this.#currentValidClass = this.#validDragClass;
    } else {
      this.#currentValidClass = this.#invalidDragClass;
    }

    placingPath.forEach((coordinate) => {
      const [row, column] = coordinate;
      try {
        const position = document.querySelector(
          `.position[data-coordinates="[${row},${column}]"]`,
        );
        position.classList.add(this.#currentValidClass);
      } catch (error) {
        console.log(error);
      }
    });
  }

  renderPlacedPositions(ship, placingPath) {
    for (let i = 0; i < placingPath.length; i++) {
      const coordinate = placingPath[i];
      const [row, column] = coordinate;
      try {
        const position = document.querySelector(
          `.position[data-coordinates="[${row},${column}]"]`,
        );
        position.classList.add(this.#currentValidClass);

        const draggingShipDot = document.createElement("div");
        draggingShipDot.classList.add("dragging-ship-dot", "static");
        draggingShipDot.style.animationDelay = `${Number(i * 0.1)}s`;
        draggingShipDot.dataset.ship = ship.name
          .toString()
          .toLowerCase()
          .replace(/\s/g, "");

        position.append(draggingShipDot);
      } catch (error) {
        console.log(error);
      }
    }
  }

  refreshAvailableShips(name) {
    try {
      const container = [...this.shipContainers].find(
        (c) => c.dataset.shipName === name,
      );
      container.style.backgroundColor = "red";
      container.style.pointerEvents = "none";
      container.firstChild.dataset.placed = true;
    } catch (error) {
      console.log(error);
      console.log("No ship was found to mark as placed");
    }
  }

  cleanDragVisuals() {
    this.playerGameboardPositions.forEach((e) => {
      e.classList.remove(this.#validDragClass);
      e.classList.remove(this.#invalidDragClass);
    });
  }

  updateAxisDirection(axis) {
    const ships = document.querySelectorAll(
      ".fleet-container div.dragging-ship-dot.static",
    );
    console.log(ships);

    let targetAxis;
    if (axis === Axis.vertical) targetAxis = `vertical`;
    else targetAxis = `horizontal`;

    ships.forEach((s) => {
      if (s.dataset.placed) return;
      s.dataset.axis = targetAxis;
    });
  }
}
