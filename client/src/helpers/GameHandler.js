export default class GameHandler {
  constructor(scene) {
    this.gameState = "Initializing";
    this.isMyTurn = false;
    this.playerDeck = [];
    this.opponentDeck = [];
    this.pileTop = null;
    this.playerHand = [];
    this.opponentHand = [];
    this.drawCount = 0;

    this.changeTurn = () => {
      while (this.drawCount !== 0) {
        scene.socket.emit("drawCard", scene.socket.id);
        this.drawCount--;
      }
      this.isMyTurn = !this.isMyTurn;
      console.log("isMyTurn: " + this.isMyTurn);
    };

    this.updateDrawCount = (drawCount) => {
      this.drawCount += drawCount
    }

    this.changeGameState = (gameState) => {
      this.gameState = gameState;
      console.log("GameState: " + this.gameState);
    };

    this.updateTop = (top) => {
      this.pileTop = top;
      console.log("this is the top card in the out pile:", this.pileTop.values.name)
    };
  }
}
