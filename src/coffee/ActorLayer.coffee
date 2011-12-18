class ActorLayer extends Layer
  constructor: (@renderer, @game) ->
    super

  redraw: ->
    @game.actors.sort (a, b) -> a.position.y - b.position.y

    @clear()

    for actor in @game.actors
      sprite = @getSprite 'actors', actor.sprite, actor.spriteIndex
      {x, y} = actor.position

      @context.fillRect x, y, 1, 1 if DEBUG

      x = (x - Math.floor(sprite.width / 2)) | 0
      y = (y - sprite.height) | 0

      @context.drawImage sprite,
                         0, 0, sprite.width, sprite.height,
                         x, y, sprite.width, sprite.height

