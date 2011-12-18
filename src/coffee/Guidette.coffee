class Guidette extends Actor
  constructor: ->
    @name   = 'Snookie'
    @sprite = 'guidette'
    @hitbox = {width: 30, height: 46}

    super

  updateSprite: (frameCount) ->
    switch @state
      when 'walking'
        # Walking frames are 10 through 15
        @spriteIndex = 10 + Math.floor((frameCount - @walkingStart) / 4) % 6
      when 'talking'
        # Talking frames are 3 and 4
        switch Math.abs(Math.round(Math.cos(frameCount / 10) * 3) % 3)
          when 0 then @spriteIndex = 0
          when 1 then @spriteIndex = 2
          when 2 then @spriteIndex = 3
      else
        # Idle automation
        switch Math.round(frameCount / 5) % 90
          # Blink
          when 4, 5, 63, 65, 83, 84 then @spriteIndex = 1
          else
            @spriteIndex = 0
