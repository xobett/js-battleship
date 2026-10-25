import { getRandomAvatarIconSrc } from "../constants/avatarIconSrcs.js";
import { Player } from "../core/player.js";
import { Axis } from "../enums/axis.js";
import { MessageModalController } from "./modalController.js";

export class GameController {
  #uiController;
  #messageModalController;

  #playerAvatarSrc = undefined;

  #player1 = undefined;
  #cpuPlayer = undefined;

  #currentAxis = Axis.vertical;
  #canAttack = true;

  #gameOver = false;

  constructor(uiController) {
    this.#uiController = uiController;
    this.#messageModalController = new MessageModalController();
  }

  init() {
    this.#uiController.init();
    this.#configureNavigation();
    this.#configureFleetPlacementBtns();
  }

  #configureNavigation() {
    this.#uiController.introScene.addEventListener("click", () => {
      this.#loadScene("menu-scene");
      this.#onEnterMenuScene();
    });

    this.#uiController.menuReturnOptn.addEventListener("click", () => {
      this.#loadScene("intro-scene");
    });
    this.#uiController.mobileMenuReturnOptn.addEventListener("click", () => {
      this.#loadScene("intro-scene");
    });

    this.#uiController.menuContinueOptn.addEventListener("click", () => {
      this.#validateBeforeEnterFleetScene();
    });
    this.#uiController.mobileMenuContinueOptn.addEventListener("click", () => {
      this.#validateBeforeEnterFleetScene();
    });

    this.#uiController.fleetReturnOptn.addEventListener("click", () => {
      this.#loadScene("menu-scene");
      this.#onReturnFromFleetPlacementScene();
    });

    this.#uiController.mobileFleetReturnOptn.addEventListener("click", () => {
      this.#loadScene("menu-scene");
      this.#onReturnFromFleetPlacementScene();
    });

    this.#uiController.fleetContinueOptn.addEventListener("click", () => {
      this.#validateBeforeEnterGameplayScene();
    });

    this.#uiController.mobileFleetContinueOptn.addEventListener("click", () => {
      this.#validateBeforeEnterGameplayScene();
    });
  }

  #validateBeforeEnterGameplayScene() {
    if (this.#player1.shipsCount() < this.#player1.fleet.length) {
      this.#messageModalController.alert(
        "Trust me, you are not that guy",
        "Make sure to place ALL of your ships before continuing!",
        "Got it!",
        () => this.#messageModalController.close(),
      );
      return;
    }

    this.#loadScene("gameplay-scene");
    this.#onEnterGameplayScene();
  }

  #validateBeforeEnterFleetScene() {
    if (this.#playerAvatarSrc === undefined) {
      this.#messageModalController.alert(
        "Wait, you don't like my avatar picks?",
        "Bad news is, you still have to pick one! Not sure which one to pick? Try Santa!",
        "I'm being silly, your avatar picks are great",
        () => this.#messageModalController.close(),
      );
      return;
    }

    const name = this.#uiController.nameInput.value;

    if (name === "") {
      this.#messageModalController.alert(
        "You must have a name!",
        'You can not be possibly named " ", right...? ',
        "Fine I'll right my name",
        () => this.#messageModalController.close(),
      );
      return;
    }
    this.#player1 = new Player(name, this.#playerAvatarSrc);

    this.#loadScene("fleet-placement-scene");
    this.#onEnterFleetPlacementScene();
  }

  #onEnterMenuScene() {
    this.#uiController.avatars.forEach((a) => {
      a.addEventListener("click", (e) => {
        this.#uiController.clearActiveAvatar();

        a.classList.add("active");
        const avatarImg = e.target.querySelector("img");
        this.#playerAvatarSrc = avatarImg.src;
      });
    });
  }

  #loadScene(scene) {
    this.#uiController.loadSceneById(scene);
  }

  #onEnterFleetPlacementScene() {
    this.#updatePlayerInfo(
      "fleet-placement-player-name",
      this.#player1.name,
      "fleet-placement-player-avatar",
      this.#player1.avatarSrc,
    );
    this.#renderPlacingGameboard();
    this.#assignOnShipDropEventHandlers();
    this.#uiController.renderDraggableShips(this.#player1.fleet);
    this.#uiController.enableAllDraggableShips();
  }

  #updatePlayerInfo(textId, text, avatarId, avatarSrc) {
    this.#uiController.updateText(textId, text);
    this.#uiController.updatePlayerAvatar(avatarId, avatarSrc);
  }

  #onReturnFromFleetPlacementScene() {
    this.#player1.clearGameboard();

    this.#uiController.clearBoardById("player-placement-board");
    this.#uiController.clearDraggableShips();
    this.#currentAxis = Axis.vertical;
  }

  #onEnterGameplayScene() {
    this.#cpuPlayer = new Player("CPU");
    this.#cpuPlayer.randomPlaceFleet();

    const playerGameboardPos = this.#player1.gameboardPositions;
    const cpuGameboardPos = this.#cpuPlayer.gameboardPositions;

    this.#uiController.renderGameplayGameboard(
      "player-board",
      playerGameboardPos,
      true,
    );
    this.#uiController.renderGameplayGameboard("cpu-board", cpuGameboardPos);

    this.#messageModalController.setClosedBy("none");
    this.#assignOnClickEnemyGameboardEventHandlers();
    this.#uiController.setCPUBoardDamageable(true);

    this.#updatePlayerInfo(
      "gameplay-player-name",
      this.#player1.name,
      "gameplay-player-avatar",
      this.#player1.avatarSrc,
    );
    const randomAvatarSrc = getRandomAvatarIconSrc();
    this.#uiController.updatePlayerAvatar(
      "gameplay-cpu-avatar",
      randomAvatarSrc,
    );

    this.#updatePlayersShipCount();
    this.#updateGameplayMessage(
      "Start by attacking one of the enemy's positions!",
    );
  }

  #updateGameplayMessage(text) {
    this.#uiController.updateText("gameplay-message-text", text);
  }

  #updatePlayersShipCount() {
    const playerShipsCountTotal = this.#player1.fleet.length.toString();
    const playerShipsCount = this.#player1.unsunkShips().toString();
    const cpuShipsCountTotal = this.#cpuPlayer.fleet.length.toString();
    const cpuShipsCount = this.#cpuPlayer.unsunkShips().toString();

    const playerTxt = `Remaining ships ${playerShipsCount} / ${playerShipsCountTotal}`;
    const cpuTxt = `Remaining ships ${cpuShipsCount} / ${cpuShipsCountTotal}`;

    this.#uiController.updateText("player-board-text", playerTxt);
    this.#uiController.updateText("cpu-board-text", cpuTxt);
  }

  #assignOnClickEnemyGameboardEventHandlers() {
    this.#uiController.cpuGameboardPositions.forEach((p) =>
      p.addEventListener("pointerup", async (e) => {
        e.preventDefault();
        this.#uiController.removeFocus();

        if (this.#gameOver) return;
        if (!this.#canAttack) return;

        const currCell = e.target;
        const currCellData = e.target.dataset;

        const coordinates = JSON.parse(currCellData.coordinates);

        const { hit, koHit } = this.#cpuPlayer.receiveAttack(coordinates);
        if (hit === undefined) return;

        this.#uiController.onEnemyAttackedPos(hit, currCell);

        if (this.#cpuPlayer.entireFleetIsSunk()) {
          this.#updateGameplayMessage(
            "You did it champ, you sunk all of your enemy's fleet!",
          );
          setTimeout(() => {
            this.#messageModalController.alert(
              "You won!",
              "What a way to go! If you had fun, please give this repository a star! :)",
              "Play again",
              () => window.location.reload(),
            );
          }, 1500);
          this.#gameOver = true;
          return;
        }

        let txt;
        if (hit) {
          if (koHit) txt = "Enemy's ship is sunk!";
          else txt = "Hit!";
        } else txt = "Miss!";

        this.#updateGameplayMessage(
          `${txt} It's the enemy's turn, brace for impact!`,
        );
        this.#updatePlayersShipCount();

        this.#canAttack = false;
        this.#uiController.setCPUBoardDamageable(false);
        await this.#receiveEnemyAttack();

        this.#canAttack = true;
        this.#uiController.setCPUBoardDamageable(true);
        this.#updatePlayersShipCount();
      }),
    );
  }

  #receiveEnemyAttack() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomCoordinates = this.#player1.getRandomAttackPos();
        const { hit: receivedHit, koHit } =
          this.#player1.receiveAttack(randomCoordinates);
        this.#uiController.onPlayerAttackedPos(receivedHit, randomCoordinates);

        if (this.#player1.entireFleetIsSunk()) {
          this.#updateGameplayMessage(
            "Game over, your enemy sunk all of your fleet!",
          );
          setTimeout(() => {
            this.#messageModalController.alert(
              "You lost!",
              "Maybe next time we will get them! If you had fun, please give this repository a star! :)",
              "Play again",
              () => {
                window.location.reload();
              },
            );
          }, 1500);
          this.#gameOver = true;
          return;
        }

        let txt;
        if (receivedHit) {
          if (koHit) txt = "The enemy sunk one of your ships!";
          else txt = "Hit!";
        } else txt = "Miss!";

        this.#updateGameplayMessage(`${txt} It's your turn, get them!`);
        resolve();
      }, 2000);
    });
  }

  #renderPlacingGameboard() {
    const gameboardPositions = this.#player1.gameboardPositions;
    this.#uiController.renderGameboard(
      "player-placement-board",
      gameboardPositions,
    );
  }

  #assignOnShipDropEventHandlers() {
    this.#uiController.placementGameboardPositions.forEach((p) => {
      p.addEventListener("pointerup", (e) => {
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        const currCellData = e.target.dataset;
        if (this.#player1.alreadyPlacedShip(selectedShip.name)) return;

        const ship = this.#player1.ship(selectedShip.name);
        const coordinates = JSON.parse(currCellData.coordinates);
        const axis = this.#currentAxis;

        const { canPlace, placingPath } = this.#player1.canPlaceShip(
          ship,
          coordinates,
          axis,
        );

        if (canPlace) {
          this.#player1.placeShip(ship, coordinates, axis);
          this.#uiController.renderPlacedPositions(ship, placingPath);
          this.#uiController.disableDraggableShip(ship.name);
        }

        this.#uiController.clearSelectedShip();
      });

      p.addEventListener("pointerenter", (e) => {
        console.log("hello");
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        const currCellData = e.target.dataset;
        if (this.#player1.alreadyPlacedShip(selectedShip.name)) return;

        const ship = this.#player1.ship(selectedShip.name);
        const coordinates = JSON.parse(currCellData.coordinates);
        const axis = this.#currentAxis;

        const { canPlace, placingPath } = this.#player1.canPlaceShip(
          ship,
          coordinates,
          axis,
        );
        this.#uiController.renderCanPlacePath(canPlace, placingPath);
      });

      p.addEventListener("pointerleave", () => {
        const selectedShip = this.#uiController.selectedShip;
        if (selectedShip === undefined) return;

        this.#uiController.cleanDragVisuals();
      });
    });
  }

  #configureFleetPlacementBtns() {
    this.#uiController.rotateShipBtn.addEventListener("click", () => {
      this.#toggleCurrentRotation();
      this.#uiController.updateAxisDirection(this.#currentAxis);
    });

    this.#uiController.restartGameboardBtn.addEventListener("click", () => {
      this.#player1.clearGameboard();

      this.#uiController.clearBoardById("player-placement-board");
      this.#renderPlacingGameboard();
      this.#assignOnShipDropEventHandlers();
      this.#uiController.enableAllDraggableShips();

      this.#currentAxis = Axis.vertical;
    });
  }

  #toggleCurrentRotation() {
    if (this.#currentAxis === Axis.vertical)
      this.#currentAxis = Axis.horizontal;
    else this.#currentAxis = Axis.vertical;
  }
}
