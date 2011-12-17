class ActorLayer extends Layer
  constructor: (@renderer, @game) ->
    super

  redraw: ->
    for name, character of @game.characters
      sprite = @getSprite 'actors', name
      {x, y} = character.position

      if DEBUG
        @context.fillStyle = 'FF0000'
        @context.fillRect x, y, sprite.width, sprite.height,

      @context.drawImage sprite,
                         0, 0, sprite.width, sprite.height,
                         x, y, sprite.width, sprite.height

      null
