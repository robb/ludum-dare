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
      when 'smoking'
        switch Math.round(frameCount / 5) % 12
          # Smoking
          when 0, 7 then @spriteIndex = 3 if @properties.hasCigarettes
          when 1, 6 then @spriteIndex = 4 if @properties.hasCigarettes
          when 2, 4 then @spriteIndex = 5 if @properties.hasCigarettes
          when 3, 5 then @spriteIndex = 6 if @properties.hasCigarettes

      else
        switch Math.round((32 + frameCount) / 5) % 50
          # Blink
          when 14, 16 then @spriteIndex = 1
          else
            @spriteIndex = 0

  clickAction: ->
    # # Round 1
    if @game.currentRound is 0
      {x, y} = @position
      @game.hero.walkTo x - 29, y, =>
        @game.isLocked       = yes
        @direction           = 'left'
        @game.hero.direction = 'right'

        @say "Here's some friendly advice, man.", =>
          @say "Stay away from that little dragon slayer over there,", =>
            @say "he almost bored me to tears with his video game ramblings.", =>
              @game.isLocked = no

    if @game.currentRound is 1
      {x, y} = @position
      @game.hero.walkTo x - 29, y, =>
        @game.isLocked       = yes
        @direction           = 'left'
        @game.hero.direction = 'right'

        @say "That Spanish chick?", =>
          @say "I feel like she's not very picky when it come to guys", =>
            @say "So even you might have a chance", =>
              @say "Haha", =>
                @game.isLocked = no
                @state = 'smoking'
