class BackgroundLayer extends Layer
  redraw: ->
    sprite = @getSprite 'backgrounds', 'flat-background'

    @context.drawImage sprite,
                       0, 0, sprite.width, sprite.height,
                       0, 0, sprite.width, sprite.height
