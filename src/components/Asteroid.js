import {
   ROIDS_JAG,
   ROIDS_MAX_RADIUS,
   ROIDS_SPEED,
   ROIDS_VERT,
   ROID_PTS_LGE,
   ROID_PTS_MED,
   ROID_PTS_SML, SPEED_DIFFICULTY
} from "@constants/variables";

export default class Asteroid {
   constructor(game, radius = 0, position) {
      this.game = game

      this.radius = radius
      this.position = position
      this.speed = {}

      this.vert = 0
      this.jags = []
      this.points = 0

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
         }
      }

      if (this.radius === ROIDS_MAX_RADIUS / 4) {
         this.points = ROID_PTS_SML
      } else if (this.radius === ROIDS_MAX_RADIUS / 2) {
         this.points = ROID_PTS_MED
      } else {
         this.points = ROID_PTS_LGE
      }

      if (!this.position) {
         this.position = {}
         if (Math.random() <= 0.5) {
            Math.random() <= 0.5 ? this.position.x = -this.radius : this.position.x = this.game.width + this.radius;
            this.position.y = Math.random() * this.game.height;
         } else {
            this.position.x = Math.random() * this.game.width;
            Math.random() <= 0.5 ? this.position.y = -this.radius : this.position.y = this.game.height + this.radius;
         }

      }

      this.speed.x = (Math.random() * 2 - 1) * ROIDS_SPEED + this.game.level * 0.01 * ROIDS_SPEED * SPEED_DIFFICULTY;
      this.speed.y = (Math.random() * 2 - 1) * ROIDS_SPEED + this.game.level * 0.01 * ROIDS_SPEED * SPEED_DIFFICULTY;

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
         this.position.x = this.game.width + this.radius
      } else if (this.position.x - this.radius > this.game.width) {
         this.position.x = -this.radius
      }
      if (this.position.y + this.radius < 0) {
         this.position.y = this.game.height + this.radius
      } else if (this.position.y - this.radius > this.game.height) {
         this.position.y = -this.radius
      }
   }

   draw(ctx) {
      ctx.strokeStyle = '#eeeeee'
      ctx.lineWidth = ROIDS_MAX_RADIUS / 25
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
