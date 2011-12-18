class Entity
  constructor: (@game) ->
    @position    ?= {x: 0, y: 0}
    @state       ?= 'default'
    @spriteIndex ?= 0
    @enabled     ?= yes
    @hitbox      ?= {width: 0, height: 0}

  hitTest: (x, y) ->
    @position.x - @hitbox.width  / 2 < x <= @position.x + @hitbox.width  / 2 and
    @position.y - @hitbox.height     < y <= @position.y

  updateSprite: (frameCount) ->
    # TODO: update sprite

  animate: ->

