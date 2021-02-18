import {BG_COLOR} from "@constants/variables";

import Game from "./Game";

import '@static/styles/main.css'

class Engine {
   constructor() {
      this.container = document.getElementById('content');
      this.canvas = document.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');

      this.prevUpdateTime = 0;

      this.init()
   }

   init() {
      this.game = new Game(this.canvas)

      window.addEventListener('resize', x => this.game.onResize(this.canvas));
      this.game.onResize(this.canvas)

      this.game.init()

      requestAnimationFrame((time) => this.loop(time))
   }


   loop(timestamp) {
      const dt = timestamp - this.prevUpdateTime;
      this.prevUpdateTime = timestamp;

      this.ctx.fillStyle = BG_COLOR
      this.ctx.fillRect(0, 0, this.game.width, this.game.height)

      this.game.update(dt)
      this.game.draw(this.ctx)

      requestAnimationFrame((time) => this.loop(time))
   }
}

new Engine();
