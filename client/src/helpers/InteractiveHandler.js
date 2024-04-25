export default class InteractiveHandler {
  constructor(scene) {
    scene.cardPreview = null;

    scene.dealCards.on("pointerdown", () => {
      scene.socket.emit("dealCards", scene.socket.id);
      scene.dealCards.disableInteractive();
      scene.dealCards.setVisible(false);
      scene.plusOne.setInteractive(); //activate plus one button here
      scene.plusOne.setColor("#ffffff");
    });
    scene.dealCards.on("pointerover", () => {
      scene.dealCards.setColor("#000000");
    });
    scene.dealCards.on("pointerout", () => {
      scene.dealCards.setColor("#ffffff");
    });

    scene.plusOne.on("pointerdown", () => {
      //TODO: logic to check if this should actually happen based on cards in your hand
      if (scene.GameHandler.isMyTurn == true) {
        scene.socket.emit("drawCard", scene.socket.id);
        scene.socket.emit("turnSkipped");
      }
    });
    scene.plusOne.on("pointerover", () => {
      scene.plusOne.setColor("#000000");
    });
    scene.plusOne.on("pointerout", () => {
      scene.plusOne.setColor("#ffffff");
    });

    scene.input.on("pointerover", (event, gameObjects) => {
      let pointer = scene.input.activePointer;
      if (
        gameObjects[0].type === "Image" &&
        gameObjects[0].data.list.name !== "cardBack"
      ) {
        scene.cardPreview = scene.add
          .image(
            pointer.worldX,
            pointer.worldY,
            gameObjects[0].data.values.sprite
          )
          .setScale(0.5, 0.5);
      }
    });

    scene.input.on("pointerout", (event, gameObjects) => {
      if (
        gameObjects[0].type === "Image" &&
        gameObjects[0].data.list.name !== "cardBack"
      ) {
        scene.cardPreview.setVisible(false);
      }
    });

    scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    scene.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0x999999);
      scene.children.bringToTop(gameObject);
      scene.cardPreview.setVisible(false);
    });

    scene.input.on("dragend", (pointer, gameObject, dropped) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    scene.input.on("drop", (pointer, gameObject, dropZone) => {
      if (
        scene.GameHandler.isMyTurn &&
        scene.GameHandler.gameState === "Ready"
      ) {
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        scene.input.setDraggable(gameObject, false);
        scene.socket.emit(
          "cardPlayed",
          gameObject.data.values.name,
          scene.socket.id
        );
      } else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }
}
