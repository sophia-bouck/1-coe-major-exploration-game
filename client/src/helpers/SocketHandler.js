import io from "socket.io-client";

export default class SocketHandler {
  constructor(scene) {
    scene.socket = io("http://localhost:3000");

    scene.socket.on("connect", () => {
      console.log("Connected!");
      scene.socket.emit("dealDeck", scene.socket.id);
    });

    scene.socket.on("firstTurn", () => {
      scene.GameHandler.changeTurn();
    });

    scene.socket.on("changeGameState", ({ state, winner }) => {
      scene.GameHandler.changeGameState(state);
      if (state === "Initializing") {
        //remove loading screen here
        scene.UIHandler.removeLoadingScreen();
        scene.DeckHandler.dealCard(750, 500, "cardBack", "opponentCard");
        scene.DeckHandler.dealCard(750, 500, "cardBack", "playerCard");
        scene.dealCards.setInteractive(); //deal cards button activated here
        scene.dealCards.setColor("#ffffff");
      } else if (state === "Win") {
        console.log("winner: ", winner, " scene.socket.id: ", scene.socket.id);
        scene.UIHandler.buildWinScreen(winner === scene.socket.id);
      }
    });

    scene.socket.on("changeTurn", () => {
      scene.GameHandler.changeTurn();
    });

    scene.socket.on("dealCards", (socketId, cards) => {
      if (socketId === scene.socket.id) {
        for (let i in cards) {
          let card = scene.GameHandler.playerHand.push(
            scene.DeckHandler.dealCard(
              155 + i * 155,
              860,
              cards[i],
              "playerCard"
            )
          );
        }
      } else {
        for (let i in cards) {
          let card = scene.GameHandler.opponentHand.push(
            scene.DeckHandler.dealCard(
              155 + i * 155,
              135,
              "cardBack",
              "opponentCard"
            )
          );
        }
      }
    });

    // card played into center stack
    scene.socket.on("cardPlayed", (cardName, socketId) => {
      if (socketId !== scene.socket.id) {
        scene.GameHandler.opponentHand.shift().destroy();
        scene.DeckHandler.dealCard(
          scene.dropZone.x,
          scene.dropZone.y,
          cardName,
          "opponentCard"
        );
      }
    });

    // card added to player hand
    scene.socket.on("drawCard", (cardName, socketId) => {
      if (socketId == scene.socket.id) {
        //TODO: how do we know which index to put them at!?
        scene.GameHandler.playerHand.push(
          scene.DeckHandler.dealCard(155, 860, cardName, "playerCard")
        );
      } else {
        scene.GameHandler.opponentHand.push(
          scene.DeckHandler.dealCard(155, 135, "cardBack", "opponentCard")
        );
      }
    });
  }
}
