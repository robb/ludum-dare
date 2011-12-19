class Hero extends Actor
  constructor: ->
    @name   = 'Hero'
    @sprite = 'hero'

    super

  updateSprite: (frameCount) ->
    switch @state
      # Idle automation
      when 'walking'
        # Walking frames are 2 through 7
        @spriteIndex = 2 + Math.floor(frameCount / 4) % 6
      when 'talking'
        # Walking frames are 2 through 7
        switch Math.floor(frameCount / 3) % 2
          when 0 then @spriteIndex = 0
          else @spriteIndex = 1
      else
        switch Math.round(frameCount / 5) % 90
          # Blink
          when 4, 5, 63, 65, 83, 84 then @spriteIndex = 1
          else
            @spriteIndex = 0

