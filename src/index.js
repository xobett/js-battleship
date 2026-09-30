import { GameController } from "./controllers/gameController.js";
import { UiController } from "./controllers/uiController.js";

const uiController = new UiController();
const gameController = new GameController(uiController);
