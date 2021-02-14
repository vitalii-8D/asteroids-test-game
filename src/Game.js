import Spaceship from "./components/Spaceship";

export default class Game {
   constructor(canvas) {
      this.container = document.getElementById('content');

      this.width = 0;
      this.height = 0;

      this.resize(canvas)

      this.init();
   }

   init() {
      this.spaceship = new Spaceship(this);
   }

   update(dt) {

   }

   draw(ctx) {
      this.spaceship.draw(ctx)
   }

   resize(canvas) {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      canvas.width = this.width;
      canvas.height = this.height;
   }
}
