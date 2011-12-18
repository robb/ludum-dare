class ForegroundLayer extends Layer
  redraw: ->
    sprite = @getSprite 'backgrounds', 'flat-foreground'

    @context.drawImage sprite,
                       0,   0, sprite.width, sprite.height,
                       438, 0, sprite.width, sprite.height
