class ActorLayer extends Layer
  constructor: (@renderer, @game) ->
    super

  redraw: ->
    for actor in @game.actors
      sprite = @getSprite 'actors', actor.file
      {x, y} = actor.position

      if DEBUG
        @context.fillStyle = 'FF0000'
        @context.fillRect x, y, sprite.width, sprite.height,

      @context.drawImage sprite,
                         0, 0, sprite.width, sprite.height,
                         x, y, sprite.width, sprite.height

      null
