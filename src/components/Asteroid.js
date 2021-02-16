import {ROIDS_NUM, ROIDS_JAG, ROIDS_MAX_RADIUS, ROIDS_SPEED, ROIDS_VERT} from "../constants";

export default class Asteroid {
   constructor(game, radius = 0) {
      this.gameWidth = game.width
      this.gameHeight = game.height

      this.radius = radius
      this.position = {x: 0, y: 0}
      this.speed = {x: 0, y: 0}

      this.vert = 0
      this.jags = []
      this.isSmallAsteroid = false

      this.init()
   }

   init() {
      if (!this.radius) {
         const sizeRandomizer = Math.random();
         if (sizeRandomizer < 0.6) {
            this.radius = ROIDS_MAX_RADIUS
         } else if (sizeRandomizer < 0.87) {
            this.radius = ROIDS_MAX_RADIUS / 2
         } else {
            this.radius = ROIDS_MAX_RADIUS / 4
            this.isSmallAsteroid = true
         }
      }

      this.position.x = Math.random() * 2 * this.gameWidth - this.gameWidth / 2
      this.position.y = Math.random() * 2 * this.gameHeight - this.gameHeight / 2

      this.speed.x = (Math.random() * 2 - 1) * ROIDS_SPEED
      this.speed.y = (Math.random() * 2 - 1) * ROIDS_SPEED

      this.vert = Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2)

      for (let i = 0; i < this.vert; i++) {
         this.jags.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG / 2)
      }
   }

   update(dt) {
      this.position.x += this.speed.x / dt
      this.position.y += this.speed.y / dt

      // Handling edges
      if (this.position.x + this.radius < 0) {
         this.position.x = this.gameWidth + this.radius
      } else if (this.position.x - this.radius > this.gameWidth) {
         this.position.x = -this.radius
      }
      if (this.position.y + this.radius < 0) {
         this.position.y = this.gameHeight + this.radius
      } else if (this.position.y - this.radius > this.gameHeight) {
         this.position.y = -this.radius
      }
   }

   draw(ctx) {
      ctx.strokeStyle = '#eeeeee'
      ctx.lineWidth = ROIDS_MAX_RADIUS / 20
      ctx.beginPath()
      ctx.moveTo(this.position.x + this.radius * this.jags[0], this.position.y)
      for (let i = 1; i < this.vert; i++) {
         ctx.lineTo(
            this.position.x + this.radius * this.jags[i] * Math.cos(2 * Math.PI / this.vert * i),
            this.position.y - this.radius * this.jags[i] * Math.sin(2 * Math.PI / this.vert * i)
         )
      }
      ctx.closePath()
      ctx.stroke()
   }
}
