$ ->
  game = new Game

  LOG "Game is #{@game}"

  i = @interactionController = new InteractionController game

  r = @renderer = new Renderer game, ->
    LOG 'Renderer callback executed'

    frameCount = 0
    mainLoop = ->
      # Sort entities by posiiton on y axis
      game.entities.sort (a, b) -> a.position.y - b.position.y

      for actor in game.entities when actor instanceof Actor
        actor.updateSprite  frameCount
        actor.performAction frameCount

      r.render()
      frameCount++
      requestAnimationFrame mainLoop

    # Here we go!
    mainLoop()
