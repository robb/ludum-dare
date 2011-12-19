class Guidette extends Actor
  constructor: ->
    @name   = 'Snookie'
    @sprite = 'guidette'
    @hitbox = {width: 30, height: 46}

    super

  updateSprite: (frameCount) ->
    switch @state
      when 'walking'
        # Walking frames are 8 through 13
        @spriteIndex = 8 + Math.floor(frameCount / 4) % 6
      when 'talking'
        # Talking frames are 3 and 4
        switch Math.abs(Math.round(Math.cos(frameCount / 10) * 3) % 3)
          when 0 then @spriteIndex = 0
          when 1 then @spriteIndex = 2
          when 2 then @spriteIndex = 3
      when 'laughing'
        @spriteIndex = 4 + Math.round(frameCount / 3) % 2
      when 'dancing'
        switch Math.round(frameCount / 3) % 4
          when 0 then @spriteIndex = 14
          when 1 then @spriteIndex = 15
          when 2 then @spriteIndex = 16
          when 3 then @spriteIndex = 15
      else
        # Idle automation
        switch Math.round(frameCount / 5) % 90
          # Blink
          when 4, 5, 63, 65, 83, 84 then @spriteIndex = 1
          else
            @spriteIndex = 0
