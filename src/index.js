import { GameController } from "./controllers/gameController.js";
import { GameMode } from "./enums/gameMode.js";

const gameController = new GameController(GameMode.single);
gameController.start();
