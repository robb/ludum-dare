$ ->
  @game = new Game

  r = @renderer = new Renderer @game, ->
    LOG 'Renderer callback executed'

    mainLoop = ->
      actor.animate() for actor in @game.actors

      r.render()
      requestAnimationFrame mainLoop

    mainLoop()
