import {SHIP_MOVE_SPD, SHIP_TURN_SPD, SHIP_RADIUS} from '../constants'

export default class SpaceShip {
   constructor(game) {
      this.gameWidth = game.width;
      this.gameHeight = game.height;

      this.position = {
         x: game.width / 2,
         y: game.height / 2
      }
      this.radius = SHIP_RADIUS
      this.angle = 90 / 180 * Math.PI
      this.rotation = 0 // Rotation flag. left: 1, right: -1. No rotation - 0
      this.moveSpeed = SHIP_MOVE_SPD
      this.turnSpeed = SHIP_TURN_SPD
   }

   update(dt) {
      this.rotate(dt)
   }

   draw(ctx) {
      const {radius, position: {x: posX, y: posY}, angle} = this

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

   rotate(dt) {
      this.angle += this.rotation * this.turnSpeed / 180 * Math.PI
   }
}
