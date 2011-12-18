class Hipster extends Actor
  constructor: ->
    super

    @name   = 'Hannes'
    @sprite = 'hipster'
    @hitbox = {width: 27, height: 55}

  updateSprite: (frameCount) ->
    switch @state
      # Idle automation
      when 'typing'
        if frameCount % 3 is 0
          @spriteIndex = 1 + Math.floor(Math.random() * 4)
      else
        @spriteIndex = 0
