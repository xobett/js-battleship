import "../css/main.css";
import "../css/bg-waves.css";
import "../css/header.css";
import "../css/game-scene.css";
import "../css/menu-scene.css";
import "../css/fleet-selection-scene.css";

export class UiController {
  #player1Board;
  #player2Board;
  constructor() {}
  renderPlayerBoard(selector, positions) {
    const domBoard = document.getElementById(selector);

    for (let i = 0; i < 100; i++) {
      const div = document.createElement("div");
      div.classList.add("position");
      domBoard.append(div);
    }
  }
}
