import GameHandler from './gameHandler'
import MenuHandler from './menuHandler'

const handlersList = {
   game: GameHandler,
   menu: MenuHandler
}

export const setHandler = (name, game) => {
   const Handler = handlersList[name]

   if (Handler) {
      if (game.inputHandler) {
         game.inputHandler.removeListeners()
      }
      console.log(game);
      return new Handler(game)
   }
}
