import { GameController } from "./controllers/gameController.js";
import { UiController } from "./controllers/uiController.js";
import { GameMode } from "./enums/gameMode.js";

const uiController = new UiController();
const gameController = new GameController(uiController);
gameController.start(GameMode.single, "Cesar");
