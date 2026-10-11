import "../css/bg-waves.css";
import "../css/header.css";
import "../css/main.css";
import "../css//scenes/intro.css";
import "../css//scenes/menu.css";
import "../css/scenes/gameplay.css";
import "../css/scenes/fleet-placement.css";

export class UiController {
  #gameScenes = [];
  #selectedSprite = undefined;
  #mouseHeld = false;
  validDrag = false;

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
    });

    document.addEventListener("pointermove", (e) => {
      if (!this.#mouseHeld) return;
      if (this.#selectedSprite === undefined) return;
      document.body.style.userSelect = "none";
      this.#selectedSprite.style.position = "absolute";
      this.#selectedSprite.style.top = e.clientY + "px";
      this.#selectedSprite.style.left = e.clientX + "px";
      this.#selectedSprite.style.transform = "translate(-50%,-100%)";
      document.body.style.cursor = "grabbing";

      this.DomPositions.forEach((p) => {
        let dragBgClass;

        if (this.canDrag) {
          dragBgClass = ".validDrag";
        } else dragBgClass = ".invaldDrag";

        if (this.#isOverlapping(this.#selectedSprite, p))
          p.classList.add(dragBgClass);
        else p.classList.remove(dragBgClass);
      });
    });
  }

  renderPlayerBoard(selector, gameboardPositions) {
    try {
      const domBoard = document.getElementById(selector);

      for (let i = 0; i < gameboardPositions.length; i++) {
        const div = document.createElement("div");
        div.classList.add("position");
        domBoard.append(div);
      }
    } catch {
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
        clone.style.draggable = true;
        document.body.append(clone);
        this.#selectedSprite = clone;
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
    this.DomPositions.forEach((e) => e.classList.remove("onDragRange"));
  }
}
