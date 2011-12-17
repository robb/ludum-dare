class Hipster extends Actor
  constructor: ->
    @name   = 'Hannes'
    @sprite = 'hipster'

    super

  animate: (frameCount) ->
    seconds = Math.round(frameCount / 60)

    switch @state
      # Idle automation
      when 'default'
        switch seconds % 15
          # Raise bottle
          when 5, 9, 10, 13 then @spriteIndex = 1
          else
            @spriteIndex = 0
