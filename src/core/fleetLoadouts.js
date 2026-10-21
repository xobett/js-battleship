import { Ship } from "./ship.js";

export const FleetLoadouts = (() => {
  const starter = {
    carrier: {
      name: "Carrier",
      size: 5,
    },
    battleship: {
      name: "Battleship",
      size: 4,
    },
    destroyer: {
      name: "Destroyer",
      size: 3,
    },
    submarine: {
      name: "Submarine",
      size: 3,
    },
    patrolBoat: {
      name: "Patrol boat",
      size: 2,
    },
  };

  const starterFleet = () => {
    const fleet = [];
    for (const s of Object.values(starter)) {
      fleet.push(new Ship(s.name, s.size));
    }
    return fleet;
  };

  return { starterFleet };
})();
