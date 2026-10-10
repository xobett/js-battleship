import { Ship } from "./ship.js";
import Battleship from "../assets/ships/Battleship.png";
import Carrier from "../assets/ships/Carrier.png";
import Destroyer from "../assets/ships/Destroyer.png";
import PatrolBoat from "../assets/ships/PatrolBoat.png";
import Submarine from "../assets/ships/Submarine.png";

export const FleetLoadouts = (() => {
  const starter = {
    carrier: {
      name: "Carrier",
      size: 5,
      spriteSrc: Carrier,
    },
    battleship: {
      name: "Battleship",
      size: 4,
      spriteSrc: Battleship,
    },
    destroyer: {
      name: "Destroyer",
      size: 3,
      spriteSrc: Destroyer,
    },
    submarine: {
      name: "Submarine",
      size: 3,
      spriteSrc: Submarine,
    },
    patrolBoat: {
      name: "Patrol boat",
      size: 2,
      spriteSrc: PatrolBoat,
    },
  };

  const starterFleet = [];
  for (const s of Object.values(starter)) {
    starterFleet.push(new Ship(s.name, s.size, s.spriteSrc));
  }

  return { starterFleet };
})();
