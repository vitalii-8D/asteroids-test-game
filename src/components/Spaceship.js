import {SHIP_MOVE_SPD, SHIP_TURN_SPD, SHIP_RADIUS, SHIP_MOVE_MAX_SPD, FRICTION} from '../constants'

export default class SpaceShip {
   constructor(game) {
      this.position = {
         x: game.width / 2,
         y: game.height / 2
      }
      this.radius = SHIP_RADIUS
      this.angle = 90 / 180 * Math.PI
      this.rotation = 0 // Rotation flag. left: 1, right: -1. No rotation - 0
      this.moving = false // true - in motion
      this.speed = {
         x: 0,
         y: 0
      }
   }

   update(dt) {
      this.rotate(dt)
      this.move(dt)
   }

   draw(ctx) {
      let {radius, position: {x: posX, y: posY}, angle} = this

      this.drawTriangle(ctx, radius, posX, posY, angle)
      this.drawFire(ctx, radius, posX, posY, angle)
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

   move(dt) {
      const fullSpeed = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2)
      if (this.moving) {
         this.accelerate(dt)
      } else if (!this.moving && !Math.floor(fullSpeed)){
         this.speed.x -= FRICTION * this.speed.x / dt
         this.speed.y -= FRICTION * this.speed.y / dt
      } else {
         this.speed.x = 0
         this.speed.y = 0
      }

      this.position.x += this.speed.x
      this.position.y += this.speed.y
   }

   drawTriangle(ctx, radius, posX, posY, angle) {
      ctx.strokeStyle = 'black'
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
      ctx.fillStyle = 'red'
      ctx.fillRect(posX - 1, posY - 1, 2, 2)
   }

   drawFire(ctx, radius, posX, posY, angle) {
      ctx.strokeStyle = 'red'
      ctx.fillStyle= 'yellow'
      ctx.lineWidth = this.radius / 10
      ctx.beginPath()
      ctx.moveTo( // nose
         posX - radius * (2 / 3 * Math.cos(angle) + Math.sin(angle)),
         posY + radius * (2 / 3 * Math.sin(angle) - Math.cos(angle))

      )
      ctx.lineTo( // left bottom
         posX - 6 / 3 * radius * Math.cos(angle),
         posY + 6 / 3 * radius * Math.sin(angle)
      )
      ctx.lineTo( // right bottom
         posX - radius * (2 / 3 * Math.cos(angle) - Math.sin(angle)),
         posY + radius * (2 / 3 * Math.sin(angle) + Math.cos(angle))
      )
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
   }
}
