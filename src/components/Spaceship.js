import {
   SHIP_MOVE_SPD,
   SHIP_TURN_SPD,
   SHIP_RADIUS,
   SHIP_MOVE_MAX_SPD,
   FRICTION,
   MAX_LASERS_NUM,
   MAX_LASERS_RANGE,
   LASERS_SPEED,
   BLINK_DUR,
   SHOW_CENTER_DOT
} from '@constants/variables'

export default class SpaceShip {
   constructor(game) {
      this.game = game

      this.position = {
         x: this.game.width / 2,
         y: this.game.height / 2
      }
      this.radius = SHIP_RADIUS
      this.angle = 90 / 180 * Math.PI
      this.rotation = 0 // Rotation flag. left: 1, right: -1. No rotation - 0
      this.moving = false // true - in motion
      this.speed = {x: 0, y: 0}
      this.lasers = []
      this.canShoot = true
      this.isDead = false

      this.explodeTime = 0;
      this.blinkNum = 0
      this.blinkTime = 0
   }

   update(dt) {
      if (this.isDead) {
         this.deathTimer()
      } else {
         this.rotate(dt)
         this.moveShip(dt)
         this.calcShooting(dt)
         this.blinkingTimer(dt)
      }
   }

   draw(ctx) {
      if (this.isDead) {
         this.drawExplosion(ctx)
      } else if (this.blinkNum % 2 === 0) {
         this.drawTriangle(ctx)
         this.drawFire(ctx)
         this.drawLasers(ctx)
      }
   }

   rotate(dt) {
      this.angle += this.rotation * SHIP_TURN_SPD / 180 * Math.PI / dt
   }

   accelerate(dt) {
      const fullSpeed = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2)
      if (fullSpeed < SHIP_MOVE_MAX_SPD) {
         this.speed.x += SHIP_MOVE_SPD * Math.cos(this.angle) / dt
         this.speed.y -= SHIP_MOVE_SPD * Math.sin(this.angle) / dt
      } else {

      }
   }

   moveShip(dt) {
      if (this.moving) {
         this.accelerate(dt)
      } else {
         this.speed.x -= FRICTION * this.speed.x / dt
         this.speed.y -= FRICTION * this.speed.y / dt
      }

      this.position.x += this.speed.x
      this.position.y += this.speed.y

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

   drawTriangle(ctx, parameters) {
      const {radius, position: {x: posX, y: posY}, angle} = parameters || this
      ctx.strokeStyle = 'white'
      ctx.lineWidth = this.radius / 10
      ctx.beginPath()
      ctx.moveTo( // nose
         posX + 4 / 3 * radius * Math.cos(angle),
         posY - 4 / 3 * radius * Math.sin(angle)
      )
      ctx.lineTo( // left bottom
         posX - radius * (2 / 3 * Math.cos(angle) + Math.sin(angle)),
         posY + radius * (2 / 3 * Math.sin(angle) - Math.cos(angle))
      )
      ctx.lineTo( // right bottom
         posX - radius * (2 / 3 * Math.cos(angle) - Math.sin(angle)),
         posY + radius * (2 / 3 * Math.sin(angle) + Math.cos(angle))
      )
      ctx.closePath();
      ctx.stroke();

      // center dot
      if (SHOW_CENTER_DOT) {
         ctx.fillStyle = 'red'
         ctx.fillRect(posX - 1, posY - 1, 2, 2)
      }
   } // drawTriangle(ctx)

   drawFire(ctx) {
      let {radius, position: {x: posX, y: posY}, angle} = this
      if (!this.moving) return;
      ctx.strokeStyle = 'red'
      ctx.fillStyle = 'yellow'
      ctx.lineWidth = this.radius / 5
      ctx.beginPath()
      ctx.moveTo( // nose
         posX - radius * (2 / 3 * Math.cos(angle) * 1.2 - 1 / 2 * Math.sin(angle)),
         posY + radius * (2 / 3 * Math.sin(angle) * 1.2 + 1 / 2 * Math.cos(angle))
      )
      ctx.lineTo( // bottom
         posX - 6 / 3 * radius * Math.cos(angle),
         posY + 6 / 3 * radius * Math.sin(angle)
      )
      ctx.lineTo( // right bottom
         posX - radius * (2 / 3 * Math.cos(angle) * 1.2 + 1 / 2 * Math.sin(angle)),
         posY + radius * (2 / 3 * Math.sin(angle) * 1.2 - 1 / 2 * Math.cos(angle))
      )
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
   } // drawFire(ctx)

   shoot() {
      if (this.lasers.length < MAX_LASERS_NUM) {
         const laser = {
            x: this.position.x + 4 / 3 * this.radius * Math.cos(this.angle),
            y: this.position.y - 4 / 3 * this.radius * Math.sin(this.angle),
            vx: LASERS_SPEED * Math.cos(this.angle),
            vy: -LASERS_SPEED * Math.sin(this.angle),
            distance: 0
         }
         this.lasers.push(laser);
      }
   }

   calcShooting(dt) {
      for (let i = this.lasers.length - 1; i >= 0; i--) {
         if (this.lasers[i].distance > MAX_LASERS_RANGE * this.game.width) {
            this.lasers.splice(i, 1)
            continue
         }
         this.lasers[i].x += this.lasers[i].vx / dt
         this.lasers[i].y += this.lasers[i].vy / dt
         this.lasers[i].distance += Math.sqrt((this.lasers[i].vx / dt) ** 2 + (this.lasers[i].vy / dt) ** 2)
      }
   }

   drawLasers(ctx) {
      if (this.lasers.length) {
         for (let i = 0; i < this.lasers.length; i++) {
            ctx.fillStyle = 'salmon'
            ctx.beginPath()
            ctx.arc(this.lasers[i].x, this.lasers[i].y, SHIP_RADIUS / 8, 0, 2 * Math.PI)
            ctx.fill()
         }
      }
   }

   deathTimer() {
      this.explodeTime--
      if (this.explodeTime === 0) {
         this.game.resetShip()
      }
   }

   drawExplosion(ctx) {
      ctx.fillStyle = 'yellow'
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'orange'
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius * 0.6, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius * 0.3, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
   } // drawExplosion(ctx)

   blinkingTimer(dt) {
      if (this.blinkNum > 0) {
         this.blinkTime--

         if (this.blinkTime === 0) {
            this.blinkNum--
            this.blinkTime = Math.ceil(BLINK_DUR * 30);
         }
      }
   }
}
