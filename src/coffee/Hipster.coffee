class Hipster extends Actor
  constructor: ->
    super

    @name   = 'Hannes'
    @sprite = 'hipster'
    @hitbox = {width: 27, height: 55}

  updateSprite: (frameCount) ->
    switch @state
      when 'walking'
        @spriteIndex = 5 + Math.floor(frameCount / 4) % 6
      when 'typing'
        if frameCount % 3 is 0
          @spriteIndex = 1 + Math.floor(Math.random() * 4)
      else
        @spriteIndex = 0

  clickAction: ->
    if @game.currentRound is 0
      {x, y} = @position
      @game.hero.walkTo x - 29, y, =>
        @game.isLocked       = yes
        @state               = 'default'
        @direction           = 'left'
        @game.hero.direction = 'right'
        # Hero and emo talk to each other
        @say "Can't you see I'm busy?", =>
          @say "I'm DJing, duh!?", =>
            @state         = 'typing'
            @game.isLocked = no

    if @game.currentRound is 1
      {x, y} = @position
      @game.hero.walkTo x - 29, y, =>
        @game.isLocked       = yes
        @state               = 'default'
        @direction           = 'left'
        @game.hero.direction = 'right'

        # Hero and emo talk to each other
        @game.student.walkTo x + 25, y, =>
          @game.student.direction = 'left'

        @say "You know, I had Berghain guestlist tonight.", =>
          @say "But that place is way to touristy for my taste", =>
            @state = 'typing'

            @game.student.say "Did you say Berghain?!", =>
              @game.student.say "I heard so much of it, where is that club?", =>
                @state     = 'default'
                @direction = 'right'

                @say 'Gah, I guess it suits you.', =>
                  @say "It's…", =>
                    @say "It's on the corner of Einbahnstraße and Sackgasse", =>
                      @say "You can't miss it", =>
                        @game.student.say "Oh thank you so much!", =>
                          @game.student.say "See you guys", =>
                            @game.student.walkTo -20, 144, =>
                              @game.currentRound = 2
                              @game.isLocked = no


    if @game.currentRound is 1
      {x, y} = @position
      @game.hero.walkTo x - 29, y, =>
        @game.isLocked       = yes
        @state               = 'default'
        @direction           = 'left'
        @game.hero.direction = 'right'

        # Hero and emo talk to each other
        @game.student.walkTo x + 25, y, =>
          @game.student.direction = 'left'

        @say "You know, I had Berghain guestlist tonight.", =>
          @say "But that place is way to touristy for my taste", =>
            @state = 'typing'

            @game.student.say "Did you say Berghain?!", =>
              @game.student.say "I heard so much of it, where is that club?", =>
                @state     = 'default'
                @direction = 'right'

                @say 'Gah, I guess it suits you.', =>
                  @say "It's…", =>
                    @say "It's on the corner of Einbahnstraße and Sackgasse", =>
                      @say "You can't miss it", =>
                        @game.student.say "Oh thank you so much!", =>
                          @game.student.say "¡Hasta luego, guys!", =>
                            @game.student.walkTo -20, 144, =>
                              @state = 'typing'
                              @game.currentRound = 2
                              @game.isLocked = no
