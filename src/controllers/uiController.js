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

  renderPlayerBoard(selector, positions) {
    const domBoard = document.getElementById(selector);

    for (let i = 0; i < 100; i++) {
      const div = document.createElement("div");
      div.classList.add("position");
      domBoard.append(div);
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

  get MenuScene() {
    return document.getElementById("menu-scene");
  }

  get GameplayScene() {
    return document.getElementById("gameplay-scene");
  }

  get FleetSelection() {
    return document.getElementById("fleet-placement-scene");
  }
}
