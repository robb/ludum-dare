$ ->
  game = new Game

  LOG "Game is #{@game}"

  r = @renderer = new Renderer game, ->
    LOG 'Renderer callback executed'

    frameCount = 0
    mainLoop = ->
      for actor in game.actors
        actor.move    frameCount
        actor.animate frameCount

      r.render()
      requestAnimationFrame mainLoop

      frameCount++

    # Here we go!
    mainLoop()
