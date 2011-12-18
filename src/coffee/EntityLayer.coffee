class EntityLayer extends Layer
  constructor: (@renderer, @game) ->
    super

  redraw: ->
    @clear()

    for entity in @game.entities
      sprite = @getSprite 'entities', entity.sprite, entity.spriteIndex
      {x, y} = entity.position

      @context.fillRect x, y, 1, 1 if DEBUG

      x = (x - Math.floor(sprite.width / 2)) | 0
      y = (y - sprite.height) | 0

      # Flip the sprite if the direction is left (default is right).
      if entity.direction is 'left'
        flipped = document.createElement 'canvas'
        flipped.width  = sprite.width
        flipped.height = sprite.height
        flippedContext = flipped.getContext '2d'

        flippedContext.translate sprite.width, 0
        flippedContext.scale -1, 1
        flippedContext.drawImage sprite, 0, 0, sprite.width, sprite.height

        sprite = flipped

      @context.drawImage sprite,
                         0, 0, sprite.width, sprite.height,
                         x, y, sprite.width, sprite.height

