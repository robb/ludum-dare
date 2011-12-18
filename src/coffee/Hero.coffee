class Hero extends Actor
  constructor: ->
    @name   = 'Hero'
    @sprite = 'hero'

    super

  animate: (frameCount) ->
    switch @state
      # Idle automation
      when 'default'
        switch Math.round(frameCount / 5) % 90
          # Blink
          when 4, 5, 63, 65, 83, 84 then @spriteIndex = 1
          else
            @spriteIndex = 0
      when 'walking'
        # Walking frames are 2 through 7
        @spriteIndex = 2 + Math.floor((frameCount - @walkingStart) / 4) % 6
