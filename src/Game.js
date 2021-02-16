import {ROIDS_NUM} from "./constants";

import SpaceShip from "./components/Spaceship";
import InputHandler from "./handlers/InputHandler";
import Asteroid from "./components/Asteroid";
import Logic from "./components/Logic";

export default class Game {
   constructor() {
      this.height = 0;
      this.width = 0;
      this.canvas = document.getElementById('canvas');

      this.asteroids = []
   }

   init() {
      this.spaceShip = new SpaceShip(this);
      this.inputHandler = new InputHandler(this)
      for (let i = 0; i < ROIDS_NUM; i++) {
         this.asteroids.push(new Asteroid(this))
      }
      this.logic = new Logic(this)
   }

   update(dt) {
      this.spaceShip.update(dt)
      this.asteroids.forEach(roid => {
         roid.update(dt)
      })
   }

   draw(ctx) {
      this.spaceShip.draw(ctx)
      this.asteroids.forEach(roid => {
         roid.draw(ctx)
      })
   }

   onResize(canvas) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      canvas.width = this.width;
      canvas.height = this.height;
   }
}
