import "../css/index.css";

export class UiController {
  #player1Board;
  #player2Board;
  constructor() {}
  renderPlayerBoard(selector) {
    const domBoard = document.getElementById(selector);

    for (let i = 0; i < 100; i++) {
      const div = document.createElement("div");
      div.classList.add("position");
      domBoard.append(div);
    }
  }
}
