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

  clickAction: ->
    # # Round 1
    if @game.currentRound is 0
      {x, y} = @position
      @game.hero.walkTo x - 25, y, =>
        @game.isLocked       = yes
        @game.hero.direction = 'right'
        @direction           = 'left'

        # Hero and student talk to each other
        @say "¡Hey!", =>
          @say "Would you mind showing me around town?", =>
            @say "(nudge nudge)", =>
              @say "I'm new here.", =>
                @say "(wink wink)", =>
                  @game.hero.say "Blo Blo Blo", =>
                    @say "Laber Laber", =>
                      # Student walks to the balcony
                      @walkTo @game.emo.position.x - 20, @game.emo.position.y, =>
                        # Student and Emo look at each other
                        @direction          = 'right'
                        @game.emo.direction = 'left'
                        # Student talks to the Emo
                        @say "La Ti Da", =>
                          @game.emo.say "Ho Ho Ho", =>
                            @say "Jumped Di Bumbel", =>
                              @game.emo.say "Boom Shakalaka", =>
                                # Emo walks into the kitchen
                                @walkTo @game.emo.position.x,
                                        @game.emo.position.y
                                @game.emo.walkTo @game.nerd.position.x - 50, @game.nerd.position.y, =>
                                  @game.emo.state = 'smoking'
                                  @game.nerd.say "Hust Hust", =>
                                    @game.nerd.walkTo -20, 144, =>
                                      @game.isLocked = no
                                      @game.currentRound = 1

  clickAction: ->
    # # Round 1
    if @game.currentRound is 0
      {x, y} = @position
      @game.hero.walkTo x - 25, y, =>
        @game.isLocked       = yes
        @game.hero.direction = 'right'
        @direction           = 'left'

        # Hero and student talk to each other
        @say "¡Hey!", =>
          @say "Do you now if there is still beer around here?", =>
            @game.hero.say "None in the fridge?", =>
              @say "Si.", =>
                @game.hero.say "Have you tried the balcony?", =>
                  @say "Smart thinking", =>
                    # Student walks to the balcony
                    @walkTo @game.emo.position.x - 20, @game.emo.position.y, =>
                      # Student and Emo look at each other
                      @direction          = 'right'
                      @game.emo.direction = 'left'
                      # Student talks to the Emo
                      @say "¡Hey!", =>
                        @game.emo.say "O my", =>
                          @say "Are you from Berlin?", =>
                            @say "Do you know any cool clubs around here?", =>
                              @say "[SUDDEN BURST OF WHITE NOISE]", =>
                                @say "[MORE WHITE NOISE]", =>
                                  @game.emo.say "GOD! Leave me alone!", =>
                                    # Emo walks into the kitchen
                                    @walkTo @game.emo.position.x,
                                            @game.emo.position.y
                                    @game.emo.walkTo @game.nerd.position.x - 50, @game.nerd.position.y, =>
                                      @game.emo.state = 'smoking'
                                      @game.nerd.say "(Choke Cough)", =>
                                        @game.nerd.say "I… can't…", =>
                                          @game.nerd.say "breathe…", =>
                                            @game.nerd.walkTo -20, 144, =>
                                              @game.isLocked = no
                                              @game.currentRound = 1

    # # Round 1
    if @game.currentRound is 1
      {x, y} = @position
      @game.hero.walkTo x - 25, y, =>
        @game.isLocked       = yes
        @game.hero.direction = 'right'
        @direction           = 'left'

        @say "Bah, I don't care about that idiot anyways.", =>
          @say "You and I can still have a lot of fun tonight, ", =>
            @say "don't you think?", =>
              @game.isLocked = no
