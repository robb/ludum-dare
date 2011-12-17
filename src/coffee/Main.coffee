$ ->
  g = @game =
    characters:
      'emo':
        position: {x: 250, y: 50}
      'pothead':
        position: {x: 250, y: 150}

  r = @renderer = new Renderer @game, ->
    LOG 'Renderer callback executed'

    renderLoop = ->
      r.render()
      REQUEST_ANIMATION_FRAME renderLoop
    renderLoop()
