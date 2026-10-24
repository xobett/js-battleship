import "../css/bg-waves.css";
import "../css/header.css";
import "../css/main.css";
import "../css/dragging-ship-dot.css";
import "../css/gameboard.css";
import "../css/scenes/intro.css";
import "../css/scenes/menu.css";
import "../css/scenes/gameplay.css";
import "../css/scenes/fleet-placement.css";
import "../css/message-modal.css";
import { Axis } from "../enums/axis.js";
import { hitSvg, missedHitSvg } from "../constants/svgIcons.js";

export class UiController {
  #gameScenes = [];
  #selectedShip = undefined;

  #canDrag = false;
  #validDragClass = "validDrag";
  #invalidDragClass = "invalidDrag";
  #currentValidClass = undefined;

  #followableIcons = [];

  constructor() {}

  //#region Getters

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

  get mobileMenuContinueOptn() {
    return document.getElementById("mobile-menu-continue-optn");
  }
  get mobileMenuReturnOptn() {
    return document.getElementById("mobile-menu-return-optn");
  }

  get fleetContinueOptn() {
    return document.getElementById("fleet-continue-optn");
  }
  get fleetReturnOptn() {
    return document.getElementById("fleet-return-optn");
  }

  get mobileFleetContinueOptn() {
    return document.getElementById("mobile-fleet-continue-optn");
  }
  get mobileFleetReturnOptn() {
    return document.getElementById("mobile-fleet-return-optn");
  }

  get placementGameboardPositions() {
    return document.querySelectorAll("#player-placement-board .position");
  }
  get shipContainers() {
    return document.querySelectorAll(".fleet-container .ship");
  }

  get rotateShipBtn() {
    return document.getElementById("rotate-ship-btn");
  }
  get restartGameboardBtn() {
    return document.getElementById("restart-gameboard-btn");
  }

  get cpuGameboardPositions() {
    return document.querySelectorAll(".cpu-container .position");
  }

  get cpuBoard() {
    return document.getElementById("cpu-board");
  }

  get avatars() {
    return document.querySelectorAll("div.avatar-icon");
  }

  get nameInput() {
    return document.getElementById("input-name");
  }

  //#endregion Getters

  init() {
    this.#onInitConfigure();
  }

  #onInitConfigure() {
    this.#gameScenes = document.querySelectorAll(".game-scene");
    this.#configureDrag();
    this.#configureCursorFollow();
  }

  #configureCursorFollow() {
    document.addEventListener("pointermove", (e) => {
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

  //#region Gameboards Render

  renderGameboard(selector, gameboardPositions) {
    try {
      const domBoard = document.getElementById(selector);

      for (let row = gameboardPositions.length - 1; row >= 0; row--) {
        const currRow = gameboardPositions[row];
        for (let column = 0; column < currRow.length; column++) {
          const pos = document.createElement("div");
          pos.classList.add("position");
          pos.dataset.coordinates = `[${row},${column}]`;
          domBoard.append(pos);
        }
      }
    } catch (e) {
      console.error(e);
      console.error(`No element with the id of ${selector} exists`);
    }
  }

  renderGameplayGameboard(selector, gameboardPositions, displayShips = false) {
    try {
      const domBoard = document.getElementById(selector);

      for (let row = gameboardPositions.length - 1; row >= 0; row--) {
        const currRow = gameboardPositions[row];
        for (let column = 0; column < currRow.length; column++) {
          const currColum = currRow[column];
          const pos = document.createElement("div");
          pos.classList.add("position");
          pos.dataset.coordinates = `[${row},${column}]`;
          domBoard.append(pos);

          if (displayShips) {
            if (currColum.ship !== null) {
              const draggingShipDot = this.#createStaticDraggingShipDot(
                currColum.ship.name,
              );
              pos.append(draggingShipDot);
            }
          }
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

  setCPUBoardDamageable(value) {
    this.cpuBoard.dataset.damageable = value;
  }

  //#endregion Gameboard Render

  //#region Dragging Ships

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
        if (e.target.hasPointerCapture(e.pointerId)) {
          e.target.releasePointerCapture(e.pointerId);
        }
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

  disableDraggableShip(name) {
    try {
      const container = [...this.shipContainers].find(
        (c) => c.dataset.shipName === name,
      );
      container.classList.add("blocked");
      container.style.pointerEvents = "none";
      container.firstChild.dataset.placed = true;
    } catch (error) {
      console.log(error);
      console.log("No ship was found to mark as placed");
    }
  }

  enableAllDraggableShips() {
    this.shipContainers.forEach((c) => {
      c.classList.remove("blocked");
      c.style.pointerEvents = "initial";
      c.firstChild.dataset.placed = false;
    });

    const ships = document.querySelectorAll(
      ".fleet-container div.dragging-ship-dot.static",
    );

    ships.forEach((s) => {
      s.dataset.axis = Axis.vertical;
    });
  }

  updateAxisDirection(axis) {
    const ships = document.querySelectorAll(
      ".fleet-container div.dragging-ship-dot.static",
    );

    let targetAxis;
    if (axis === Axis.vertical) targetAxis = Axis.vertical;
    else targetAxis = Axis.horizontal;

    ships.forEach((s) => {
      if (s.dataset.placed === "true") return;
      s.dataset.axis = targetAxis;
    });
  }

  //#endregion Dragging Ships

  //#region Placing path render

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

        const draggingShipDot = this.#createStaticDraggingShipDot(ship.name, i);
        position.append(draggingShipDot);
      } catch (error) {
        console.log(error);
      }
    }
  }

  #createStaticDraggingShipDot(shipName, delay = undefined) {
    const draggingShipDot = document.createElement("div");
    draggingShipDot.classList.add("dragging-ship-dot", "static");

    if (delay !== undefined) {
      draggingShipDot.style.animationDelay = `${Number(delay * 0.1)}s`;
    }

    draggingShipDot.dataset.ship = shipName
      .toString()
      .toLowerCase()
      .replace(/\s/g, "");

    return draggingShipDot;
  }

  cleanDragVisuals() {
    this.placementGameboardPositions.forEach((e) => {
      e.classList.remove(this.#validDragClass);
      e.classList.remove(this.#invalidDragClass);
    });
  }

  //#endregion Placing path render

  onEnemyAttackedPos(hit, pos) {
    if (hit) {
      pos.innerHTML += hitSvg;
    } else {
      pos.innerHTML += missedHitSvg;
    }
  }

  onPlayerAttackedPos(hit, coordinates) {
    const [row, column] = coordinates;
    const position = document.querySelector(
      `.player-container .position[data-coordinates="[${row},${column}]"]`,
    );

    if (hit) {
      position.innerHTML += hitSvg;
    } else {
      position.innerHTML += missedHitSvg;
    }
  }

  updateText(id, text) {
    try {
      const elem = document.getElementById(id);
      elem.textContent = text;
    } catch (error) {
      console.log(error);
    }
  }

  clearActiveAvatar() {
    this.avatars.forEach((av) => av.classList.remove("active"));
  }

  updatePlayerAvatar(id, src) {
    const avatarIcon = document.getElementById(id);
    avatarIcon.src = src;
  }
}
