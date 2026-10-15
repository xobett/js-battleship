import "../css/bg-waves.css";
import "../css/header.css";
import "../css/main.css";
import "../css/cursorFollow.css";
import "../css//scenes/intro.css";
import "../css//scenes/menu.css";
import "../css/scenes/gameplay.css";
import "../css/scenes/fleet-placement.css";

export class UiController {
  #gameScenes = [];
  #selectedShip = undefined;
  #mouseHeld = false;
  #currentRotation = "vertical";

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
    document.addEventListener("pointerdown", () => {
      this.#mouseHeld = true;
    });

    document.addEventListener("pointerup", () => {
      this.#mouseHeld = false;
      document.body.style.userSelect = "initial";
      document.body.style.cursor = "initial";
      this.cleanDragVisuals();

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

  cleanBoardById(id) {
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
      const img = document.createElement("img");
      img.src = currShip.spriteSrc;
      currContainer.append(img);

      img.dataset.color = currShip.color;
      img.dataset.selected = false;
      img.dataset.shipName = currShip.name;
      img.dataset.axis = this.#currentRotation;
      img.style.pointerEvents = "none";

      currContainer.addEventListener("pointerdown", (e) => {
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

        for (let i = 0; i < currShip.size; i++) {
          const x = e.clientX;
          const y = e.clientY;

          const followableIcon = document.createElement("div");
          followableIcon.classList.add("cursor-follow");

          followableIcon.style.transitionDelay = `${Number(i * 0.001)}s`;
          followableIcon.style.animationDelay = `${Number(i * 0.1)}s`;
          followableIcon.style.top = `${y}px`;
          followableIcon.style.left = `${x}px`;
          this.#followableIcons.push(followableIcon);
          document.body.append(followableIcon);
        }
      });
    }
  }

  clearSelectedShip() {
    this.#selectedShip.remove();
    this.#selectedShip = undefined;
  }

  renderPlacingPath(canPlace, placingPath) {
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

  cleanDragVisuals() {
    this.playerGameboardPositions.forEach((e) => {
      e.classList.remove(this.#validDragClass);
      e.classList.remove(this.#invalidDragClass);
    });
  }
}
