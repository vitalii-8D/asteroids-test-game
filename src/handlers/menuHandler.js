import {gameStates} from "@constants/game-states";

export default class GameHandler {
   constructor(game) {
      this.game = game

      document.addEventListener('keydown', this.downListener)
      document.addEventListener('keyup', this.upListener)
   }

   downListener(event) {
      switch (event.keyCode) {
         case 37: { // Left

            break
         }
         case 38: { // Top

            break
         }
         case 39: { // Right

            break
         }
         case 32: { // Space

            break
         }
         case 27: { // Esc

            break
         }
      }
   }

   upListener(event) {
      switch (event.keyCode) {
         case 37: { // Left

            break
         }
         case 38: { // Top

            break
         }
         case 39: { // Right

            break
         }
         case 32: { // Space

            break
         }
      }
   }

   removeListeners() {
      document.removeEventListener('keydown', this.downListener)
      document.removeEventListener('keyup', this.upListener)
   }
}
