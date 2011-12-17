class Hero extends Actor
  constructor: ->
    @name   = 'Hero'
    @sprite = 'hero'
    @spriteIndex = 1

    super

  animate: (frameCount) ->
    switch @state
      # Idle automation
      when 'default'
        switch Math.round(frameCount / 5) % 90
          # Blink
          when 4, 5, 63, 65, 83, 84 then @spriteIndex = 0
          else
            @spriteIndex = 1
      when 'walking'
        @spriteIndex = 1
