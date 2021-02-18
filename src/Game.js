import {
   EXPLODE_DUR,
   ROIDS_NUM,
   INVIS_DUR,
   BLINK_DUR,
   PARTICLES_COUNT,
   PARTICLES_LIFETIME,
   MAX_PARTICLES_SIZE,
   ROIDS_MAX_RADIUS,
   MAX_LIVES,
   ROID_PTS_SML,
   TEXT_SIZE
} from "@constants/variables";
import {gameStates} from "@constants/game-states";

import SpaceShip from "./components/Spaceship";
import Asteroid from "./components/Asteroid";

import {setHandler} from '@handlers/index'
import {getDistance} from "./helpers";

export default class Game {
   constructor() {
      this.height = 0;
      this.width = 0;

      this.asteroids = []
      this.particles = []

      this.highScore = 0;
      this.score = 0;

      this.state = gameStates.GAME
      this.gameOverSlideTimer = 0
   }

   init() {
      this.spaceShip = new SpaceShip(this);
      // add asteroids
      for (let i = 0; i < ROIDS_NUM; i++) {
         this.asteroids.push(new Asteroid(this))
      }
      this.lives = MAX_LIVES

      const hiScore = window.localStorage.getItem('high-score');
      if (hiScore) {
         this.highScore = +hiScore
      } else {
         window.localStorage.setItem('high-score', '0')
      }

      this.inputHandler = setHandler('game', this)
   }

   update(dt) {
      if (this.state === gameStates.PAUSE) return;

      for (let i = 0; i < this.asteroids.length; i++) {
         this.asteroids[i].update(dt)
      }
      this.calculateParticles(dt)
      if (this.state === gameStates.GAME_OVER) return;
      this.spaceShip.update(dt)
      this.checkCollisions(dt)
   }

   draw(ctx) {
      this.spaceShip.draw(ctx)
      for (let i = 0; i < this.asteroids.length; i++) {
         this.asteroids[i].draw(ctx)
      }
      this.drawParticles(ctx)
      this.drawLives(ctx)
      this.drawScore(ctx)
      if (this.state === gameStates.PAUSE) {
         this.drawPause(ctx)
      }
      if (this.state === gameStates.GAME_OVER) {
         this.drawGameOver(ctx)
      }
   }

   onResize(canvas) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      canvas.width = this.width;
      canvas.height = this.height;
   }

   resetShip() {
      this.spaceShip = new SpaceShip(this)
      this.spaceShip.blinkNum = Math.ceil(INVIS_DUR / BLINK_DUR);
      this.spaceShip.blinkTime = Math.ceil(BLINK_DUR * 30);
   }

   collapseAsteroid(i) {
      if (this.asteroids[i].points !== ROID_PTS_SML) {
         this.asteroids.push(new Asteroid(this, this.asteroids[i].radius / 2, {...this.asteroids[i].position}))
         this.asteroids.push(new Asteroid(this, this.asteroids[i].radius / 2, {...this.asteroids[i].position}))
      }

      this.score += this.asteroids[i].points;
      if (this.score > this.highScore) {
         this.highScore = this.score
      }

      this.setParticles(this.asteroids[i].position.x, this.asteroids[i].position.y, this.asteroids[i].radius)
      this.asteroids.splice(i, 1)
   }

   checkCollisions(dt) {
      if (this.spaceShip.isDead) {
         if (this.lives === 0) {
            this.state = gameStates.GAME_OVER
            if (this.score > this.highScore) {
               window.localStorage.setItem('high-score', `${this.score}`)
            }
            // this.gameOverSlideTimer = 200
         }
         return
      }

      for (let i = this.asteroids.length - 1; i >= 0; i--) {
         // check ship collision
         if (this.spaceShip.blinkNum === 0) {
            const dist = getDistance(
               this.spaceShip.position.x,
               this.spaceShip.position.y,
               this.asteroids[i].position.x,
               this.asteroids[i].position.y)

            if (dist < this.spaceShip.radius + this.asteroids[i].radius) {
               this.spaceShip.isDead = true
               this.spaceShip.explodeTime = Math.floor(EXPLODE_DUR / dt)

               this.lives--

               this.collapseAsteroid(i)
            }
         }

         // check lasers collisions
         for (let j = 0; j < this.spaceShip.lasers.length; j++) {
            const dist = getDistance(
               this.spaceShip.lasers[j].x,
               this.spaceShip.lasers[j].y,
               this.asteroids[i].position.x,
               this.asteroids[i].position.y)
            if (dist < this.asteroids[i].radius * 1.2) {
               this.spaceShip.lasers.splice(j, 1)
               this.collapseAsteroid(i)
               break;
            }
         }
      } // asteroids cycle
   } // checkCollisions()

   setParticles(x, y, radius) {
      for (let i = 0; i < PARTICLES_COUNT; i++) {
         this.particles.push({
            x,
            y,
            vx: Math.random() - 0.5,
            vy: Math.random() - 0.5,
            lifetime: Math.ceil(Math.random() * (PARTICLES_LIFETIME - PARTICLES_LIFETIME * 0.2) + PARTICLES_LIFETIME * 0.2),
            size: MAX_PARTICLES_SIZE * radius / ROIDS_MAX_RADIUS
         })
      }
   }

   calculateParticles(dt) {
      if (this.particles.length) {
         for (let i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].lifetime === 0) {
               this.particles.splice(i, 1)
               continue
            }

            this.particles[i].x += this.particles[i].vx * dt
            this.particles[i].y += this.particles[i].vy * dt
            this.particles[i].lifetime--;
         }
      }
   }

   drawParticles(ctx) {
      if (this.particles.length && this.particles.some(part => part.lifetime > 0)) {
         for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].lifetime === 0) continue;
            const {x, y, size} = this.particles[i]

            ctx.fillStyle = 'darkgrey'
            ctx.fillRect(x - size / 2, y - size / 2, size, size)
         }
      }
   }

   drawLives(ctx) {
      for (let i = 0; i < this.lives; i++) {
         const parameters = {
            radius: this.spaceShip.radius,
            position: {x: this.spaceShip.radius * 1.5 + this.spaceShip.radius * 2.3 * i, y: this.spaceShip.radius * 2},
            angle: 90 * Math.PI / 180
         }
         this.spaceShip.drawTriangle(ctx, parameters)
      }
   }

   drawScore(ctx) {
      // Draw score
      ctx.fillStyle = 'white'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.font = 'small-caps ' + TEXT_SIZE + 'px dejavu sans mono';
      ctx.fillText(this.score, this.width - this.spaceShip.radius * 2, this.spaceShip.radius * 2)
      // Draw HI score
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`HI: ${this.highScore}`, this.width / 2, this.spaceShip.radius * 2)
   }

   drawPause(ctx) {
      ctx.fillStyle = '#000000'
      ctx.globalAlpha = 0.7
      ctx.fillRect(0, 0, this.width, this.height)
      ctx.globalAlpha = 1
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.font = 'small-caps ' + TEXT_SIZE * 2 + 'px dejavu sans mono';
      ctx.fillText('PAUSE', this.width / 2, this.height / 2 - this.height / 5)
   }

   drawGameOver(ctx) {
      ctx.fillStyle = '#000000'
      ctx.globalAlpha = 0.7
      ctx.fillRect(0, 0, this.width, this.height)
      ctx.globalAlpha = 1
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.font = 'small-caps ' + TEXT_SIZE * 2 + 'px dejavu sans mono';
      ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - this.height / 4)
      ctx.font = 'small-caps ' + TEXT_SIZE + 'px dejavu sans mono';
      ctx.fillText(`Your score: ${this.score}      HI score: ${this.highScore}`, this.width / 2, this.height / 2)
      ctx.fillText(`Press SPACEBAR to another try`, this.width / 2, this.height - this.height / 3)
   }
}
