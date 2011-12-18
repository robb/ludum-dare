class Emo extends Actor
  constructor: ->
    @name   = 'Erik'
    @sprite = 'emo'
    @hitbox = {width: 28, height: 59}

    @properties =
      hasCigarettes: yes

    super

  updateSprite: (frameCount) ->
    switch @state
      when 'walking'
        # Walking frames are 7 through 12
        @spriteIndex = 7 + Math.floor(frameCount / 4) % 6
      when 'talking'
        switch Math.round(frameCount / 5) % 2
          when 0 then @spriteIndex = 0
          when 1 then @spriteIndex = 2
      else
        switch Math.round((32 + frameCount) / 5) % 50
          # Blink
          when 14, 16 then @spriteIndex = 1
          when 41, 42 then @spriteIndex = 1 unless @properties.hasCigarettes
          # Smoking
          when 40, 47 then @spriteIndex = 3 if @properties.hasCigarettes
          when 41, 46 then @spriteIndex = 4 if @properties.hasCigarettes
          when 42, 44 then @spriteIndex = 5 if @properties.hasCigarettes
          when 43, 45 then @spriteIndex = 6 if @properties.hasCigarettes
          else
            @spriteIndex = 0

