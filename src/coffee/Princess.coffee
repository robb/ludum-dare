class Princess extends Actor
  constructor: ->
    @name   = 'Princess'
    @sprite = 'princess'
    @hitbox = {width: 30, height: 46}

    super

  updateSprite: (frameCount) ->
    switch @state
      when 'walking'
        # Walking frames are 8 through 13
        @spriteIndex = 8 + Math.floor(frameCount / 4) % 6
      when 'talking'
        # Talking frames are 3 and 4
        switch Math.round(frameCount / 5) % 2
          when 0 then @spriteIndex = 0
          when 1 then @spriteIndex = 2
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

  clickAction: ->
    # # Round 1
    if @game.currentRound is 0
      {x, y} = @position
      @game.hero.walkTo x + 20, y, =>
        @game.isLocked       = yes
        @direction           = 'right'
        @game.hero.direction = 'left'

        @say "Hey, did you invite that creep in the kitchen?", =>
          @game.isLocked = no

    if @game.currentRound is 1
      {x, y} = @position
      @game.hero.walkTo x + 20, y, =>
        @game.isLocked       = yes
        @direction           = 'right'
        @game.hero.direction = 'left'

        @say "It's nice of you to drop by.", =>
          @game.isLocked = no

    if @game.currentRound is 2
      {x, y} = @position
      @game.hero.walkTo x + 20, y, =>
        @game.isLocked       = yes
        @direction           = 'right'
        @game.hero.direction = 'left'

        @say "All these people keep me pretty busy", =>
          @game.isLocked = no

    if @game.currentRound is 3
      {x, y} = @position
      @game.hero.walkTo x + 20, y, =>
        @game.isLocked       = yes
        @direction           = 'right'
        @game.hero.direction = 'left'

        @say "It's getting late", =>
          @game.isLocked = no

    if @game.currentRound is 4
      {x, y} = @position
      @game.hero.walkTo x + 20, y, =>
        @game.isLocked       = yes
        @direction           = 'right'
        @game.hero.direction = 'left'

        @say "Is there something you want to tell me?", =>
          @game.hero.say "I don't think so.", =>
            @game.isLocked = no

    if @game.currentRound is 5
      {x, y} = @position
      @game.hero.walkTo x + 20, y, =>
        @game.isLocked       = yes
        @direction           = 'right'
        @game.hero.direction = 'left'

        @say "Why did you do all this?", =>
          @say "Just to be ALONE™ with me?", =>
            @game.hero.say "No.", =>
              @game.hero.say "Just to win Ludum Dare", =>
                document.location = "http://www.ludumdare.com/compo/ludum-dare-22/?action=rate&uid=7864"
