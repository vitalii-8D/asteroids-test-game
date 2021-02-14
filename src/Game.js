import SpaceShip from "./components/SpaceShip";
import InputHandler from "./handlers/InputHandler";

export default class Game {
   constructor() {


      this.height = 0;
      this.width = 0;

      this.init();
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

   // onResize() {
   //    this.width = this.container.clientWidth;
   //    this.height = this.container.clientHeight;
   //
   //    this.canvas.width = this.width;
   //    this.canvas.height = this.height;
   // }
}
