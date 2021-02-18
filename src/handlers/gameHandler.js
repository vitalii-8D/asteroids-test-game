import {gameStates} from "@constants/game-states";

export default class GameHandler {
   constructor(game) {
      this.game = game
      console.log(this.game);

      document.addEventListener('keydown', this.downListener)
      document.addEventListener('keyup', this.upListener)
   }

   downListener = (event) => {
      switch (event.keyCode) {
         case 37: { // Left
            this.game.spaceShip.rotation = 1
            break
         }
         case 38: { // Top
            this.game.spaceShip.moving = true
            break
         }
         case 39: { // Right
            this.game.spaceShip.rotation = -1
            break
         }
         case 32: { // Space
            if (this.game.spaceShip.canShoot) {
               this.game.spaceShip.shoot()
               this.game.spaceShip.canShoot = false
            }
            break
         }
         case 27: { // Esc
            if (this.game.state === gameStates.GAME) {
               this.game.state = gameStates.PAUSE
            } else {
               this.game.state = gameStates.GAME
            }
            break
         }
      }
   }

   upListener = (event) => {
      switch (event.keyCode) {
         case 37: { // Left
            this.game.spaceShip.rotation = 0
            break
         }
         case 38: { // Top
            this.game.spaceShip.moving = false
            break
         }
         case 39: { // Right
            this.game.spaceShip.rotation = 0
            break
         }
         case 32: { // Space
            this.game.spaceShip.canShoot = true
            break
         }
      }
   }

   removeListeners() {
      document.removeEventListener('keydown', this.downListener)
      document.removeEventListener('keyup', this.upListener)
   }
}
