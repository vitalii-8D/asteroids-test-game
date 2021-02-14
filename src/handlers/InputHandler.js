
export default class InputHandler {
   constructor(game) {
      const {spaceShip} = game

      document.addEventListener('keydown', (event) => {
         switch (event.keyCode) {
            case 37: { // Left
               spaceShip.rotation = 1
               break
            }
            case 38: { // Top

               break
            }
            case 39: { // Right
               spaceShip.rotation = -1
               break
            }
         }
      })

      document.addEventListener('keyup', (event) => {
         switch (event.keyCode) {
            case 37: { // Left
               spaceShip.rotation = 0
               break
            }
            case 38: { // Top

               break
            }
            case 39: { // Right
               spaceShip.rotation = 0
               break
            }
         }
      })

   }
}
