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

  clickAction: ->
    # # Round 1
    if @game.currentRound is 0
      {x, y} = @position
      @game.hero.walkTo x + 25, y, =>
        @game.isLocked = yes

        @game.hero.direction = 'left'
        @direction           = 'right'

        @say "Woohoo, 18 hours without sleep.", =>
          @say "I'm a party machine!", =>
            @state = 'dancing'
            @game.isLocked = no

    # # Round 2
    if @game.currentRound is 1
      {x, y} = @position
      @game.hero.walkTo x + 25, y, =>
        @game.isLocked = yes

        @game.hero.direction = 'left'
        @direction           = 'right'

        @say "That Hipster over there with the laptop?", =>
          @say "He has like no taste in music", =>
            @state = 'default'
            @game.isLocked = no


    # # Round 3
    if @game.currentRound is 2
      {x, y} = @position
      @game.hero.walkTo x + 25, y, =>
        @game.isLocked = yes

        @game.hero.direction = 'left'
        @direction           = 'right'

        @say "This music sucks, I guess it's up to me now", =>
          @game.hipster.walkTo 313, 150, =>
            @game.hipster.right

          @walkTo 333, 150, =>
            @say "Oh yeah baby!", =>
              @say "Bring it on!", =>
                @state = 'dancing'

                @game.hipster.say "O my god!", =>
                  @game.hipster.say "I'm outta here", =>
                    @game.hipster.walkTo -20, 144, =>
                      @game.currentRound = 3
                      @game.isLocked = no

    # # Round 4
    if @game.currentRound is 3
      {x, y} = @position
      @game.hero.walkTo x - 25, y, =>
        @game.isLocked = yes

        @direction           = 'left'
        @game.hero.direction = 'right'

        @say "That creep in the kitches keeps staring at me.", =>
          @say "Woohoo!", =>
            @state = 'dancing'
            @game.isLocked = no

    # # Round 5
    if @game.currentRound is 4
      {x, y} = @position
      @game.hero.walkTo x - 25, y, =>
        @game.isLocked = yes

        @direction           = 'left'
        @game.hero.direction = 'right'
        @state               = 'default'

        @game.hero.say "Do you see my friend over there, in the kitchen.", =>
          @say "Uhuh?", =>
            @game.hero.say "He's kinda, well, the quiet type.", =>
              @say "Uhuh?", =>
                @game.hero.say "But I get the impression he really likes you.", =>
                  @say "I see what you're getting at…", =>
                    @walkTo @game.emo.position.x - 20, @game.emo.position.y, =>
                      @direction = 'right'
                      @say "*whispers in his ear*", =>
                        @state = 'dancing'
                        @game.emo.say "Oh Christ, no!", =>
                          @game.emo.walkTo -20, 144, =>
                            @say "Wait for me!", =>
                              @walkTo -20, 144, =>
                                @game.isLocked = no
                                @game.currentRound = 5
