import { GameController } from "./controllers/gameController.js";
import { UiController } from "./controllers/uiController.js";

const gameController = new GameController(new UiController());
gameController.init();
