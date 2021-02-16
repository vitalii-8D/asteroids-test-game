import {getDistance} from "../helpers";

export default class Logic {
   constructor(game) {
      this.spaceShip = game.spaceShip
      this.asteroids = game.asteroids
   }

   update(dt) {
   }

   draw(ctx) {

   }

   checkShipCollision() {
      for (let i = this.asteroids.length - 1; i >=0; i--) {
         if (getDistance(this.spaceShip.))
      }
   }
}
