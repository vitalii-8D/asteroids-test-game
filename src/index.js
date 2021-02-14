import Game from "./Game";

import '@static/styles/main.css'

class Engine {
   constructor() {
      this.container = document.getElementById('content');
      this.canvas = document.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');

      this.prevUpdateTime = 0;
      this.height = 0;
      this.width = 0;
      this.init()
   }

   init() {
      window.addEventListener('resize', x => this.onResize());
      this.onResize()

      this.game = new Game()

      requestAnimationFrame((time) => this.loop(time))
   }


   loop(timestamp) {
      const dt = timestamp - this.prevUpdateTime;
      this.prevUpdateTime = timestamp;

      this.ctx.clearRect(0, 0, this.game.width, this.game.height)
      console.log(this.game.height);

      this.game.update(dt)
      this.game.draw(this.ctx)

      requestAnimationFrame((time) => this.loop(time))
   }

   onResize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.canvas.width = this.width;
      this.canvas.height = this.height;
   }
}

new Engine();
