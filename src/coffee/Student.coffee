class Student extends Actor
  constructor: ->
    @name   = 'Lucia'
    @sprite = 'student'
    @hitbox = {width: 20, height: 55}

    super

  updateSprite: (frameCount) ->
    switch @state
      when 'walking'
        # Walking frames are 12 through 17
        @spriteIndex = 11 + Math.floor(frameCount / 4) % 6
      when 'talking'
        # Talking frames are 3 and 4
        switch Math.abs(Math.round(Math.cos(frameCount / 10) * 3) % 3)
          when 0 then @spriteIndex = 0
          when 1 then @spriteIndex = 4
          when 2 then @spriteIndex = 5
      when 'laughing'
        @spriteIndex = 6 + Math.round(frameCount / 3) % 3
      when 'dancing'
        switch Math.round(frameCount / 3) % 4
          when 0 then @spriteIndex = 14
          when 1 then @spriteIndex = 15
          when 2 then @spriteIndex = 16
          when 3 then @spriteIndex = 15
      else
        # Idle automation
        switch Math.round(33 + frameCount / 5) % 90
          # Blink
          when 0, 1, 53, 55, 83 then @spriteIndex = 3
          else
            @spriteIndex = 0
