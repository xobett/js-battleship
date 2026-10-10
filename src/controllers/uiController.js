import "../css/bg-waves.css";
import "../css/header.css";
import "../css/main.css";
import "../css//scenes/intro.css";
import "../css//scenes/menu.css";
import "../css/scenes/gameplay.css";
import "../css/scenes/fleet-placement.css";

export class UiController {
  #gameScenes = [];
  constructor() {
    this.#gameScenes = document.querySelectorAll(".game-scene");
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
}
