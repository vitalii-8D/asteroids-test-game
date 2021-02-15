import SpaceShip from "./components/SpaceShip";
import InputHandler from "./handlers/InputHandler";

export default class Game {
   constructor() {
      this.height = 0;
      this.width = 0;
   }

   init() {
      this.spaceShip = new SpaceShip(this);
      this.inputHandler = new InputHandler(this)
   }

   update(dt) {
      this.spaceShip.update(dt)
   }

   draw(ctx) {
      this.spaceShip.draw(ctx)
   }

   onResize(canvas) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      canvas.width = this.width;
      canvas.height = this.height;
   }
}
