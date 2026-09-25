import { GameController } from "./controllers/gameController.js";
import { GameMode } from "./enums/gameMode.js";

const gameController = new GameController();
gameController.start(GameMode.single, "Cesar");
