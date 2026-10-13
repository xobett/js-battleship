import "../css/bg-waves.css";
import "../css/header.css";
import "../css/main.css";
import "../css//scenes/intro.css";
import "../css//scenes/menu.css";
import "../css/scenes/gameplay.css";
import "../css/scenes/fleet-placement.css";

export class UiController {
  #gameScenes = [];
  #selectedShip = undefined;
  #mouseHeld = false;
  #currentRotation = "vertical";

  validDrag = false;
  validDragClass = "validDrag";
  invalidDragClass = "invalidDrag";
  currentValidClass = undefined;

  get selectedShip() {
    return this.#selectedShip;
  }

  get IntroScene() {
    return document.getElementById("intro-scene");
  }

  get MenuContinueOptn() {
    return document.getElementById("menu-continue-optn");
  }
  get MenuReturnOptn() {
    return document.getElementById("menu-return-optn");
  }

  get FleetContinueOptn() {
    return document.getElementById("fleet-continue-optn");
  }
  get FleetReturnOptn() {
    return document.getElementById("fleet-return-optn");
  }

  get DomPositions() {
    return document.querySelectorAll(".position");
  }
  get ShipContainers() {
    return document.querySelectorAll(".fleet-container .ship");
  }

  cleanBoardById(id) {
    try {
      const board = document.getElementById(id);
      board.replaceChildren();
    } catch {
      console.error(`No element with the id of ${id} exists`);
    }
  }

  constructor() {
    this.#gameScenes = document.querySelectorAll(".game-scene");
  }

  init() {
    this.#handleDrag();
  }

  setDragValidity(value) {
    this.canDrag = value;
  }

  #handleDrag() {
    document.addEventListener("pointerdown", () => {
      this.#mouseHeld = true;
    });

    document.addEventListener("pointerup", () => {
      this.#mouseHeld = false;
      document.body.style.userSelect = "initial";
      document.body.style.cursor = "initial";
      this.#cleanDomPositionsDraggableClasses();

      if (this.#selectedShip !== undefined) this.clearSelectedShip();
    });

    document.addEventListener("pointermove", (e) => {
      if (!this.#mouseHeld) return;
      if (this.#selectedShip === undefined) return;

      document.body.style.userSelect = "none";
      this.#selectedShip.style.position = "absolute";
      this.#selectedShip.style.top = e.clientY + "px";
      this.#selectedShip.style.left = e.clientX + "px";
      this.#selectedShip.style.transform = "translate(-50%,-100%)";
      document.body.style.cursor = "grabbing";

      this.#cleanDomPositionsDraggableClasses();
      this.DomPositions.forEach((p) => {
        if (this.canDrag) {
          this.currentValidClass = this.validDragClass;
        } else this.currentValidClass = this.invalidDragClass;

        if (this.#isOverlapping(this.#selectedShip, p))
          p.classList.add(this.currentValidClass);
      });
    });
  }

  clearSelectedShip() {
    this.#selectedShip.remove();
    this.#selectedShip = undefined;
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

  loadSceneById(sceneId) {
    this.#gameScenes.forEach((scene) => scene.classList.remove("active"));
    try {
      const scene = document.getElementById(sceneId);
      scene.classList.add("active");
    } catch {
      console.error(`No element with the id of ${sceneId} exists`);
    }
  }

  renderDraggableShips(playerFleet) {
    for (let i = 0; i < this.ShipContainers.length; i++) {
      const domContainer = this.ShipContainers[i];
      const currShip = playerFleet[i];
      const img = document.createElement("img");
      img.src = currShip.spriteSrc;
      domContainer.append(img);

      img.dataset.selected = false;
      img.dataset.shipName = currShip.name;
      img.dataset.axis = this.#currentRotation;
      img.style.pointerEvents = "none";

      domContainer.addEventListener("pointerdown", (e) => {
        const img = e.target.firstChild;
        const clone = img.cloneNode();
        clone.style.position = "absolute";
        clone.style.top = e.clientY + "px";
        clone.style.left = e.clientX + "px";
        if (currShip.name === "Carrier") {
          clone.style.width = "41px";
          clone.style.height = "200px";
        }
        document.body.append(clone);
        this.#selectedShip = clone;
      });
    }
  }

  #isOverlapping(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    const isOnRange =
      aRect.left > bRect.left &&
      aRect.right < bRect.right &&
      aRect.bottom > bRect.top &&
      aRect.top < bRect.bottom;

    return isOnRange;
  }

  #cleanDomPositionsDraggableClasses() {
    this.DomPositions.forEach((e) =>
      e.classList.remove(this.currentValidClass),
    );
  }
}
