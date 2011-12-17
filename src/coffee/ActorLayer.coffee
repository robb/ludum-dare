class ActorLayer extends Layer
  constructor: (@renderer, @game) ->
    super

  redraw: ->
    @clear()

    for actor in @game.actors
      sprite = @getSprite 'actors', actor.sprite, actor.spriteIndex
      {x, y} = actor.position

      @context.drawImage sprite,
                         0, 0, sprite.width, sprite.height,
                         x, y, sprite.width, sprite.height

