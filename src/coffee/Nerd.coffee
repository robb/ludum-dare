class Nerd extends Actor
  constructor: ->
    @name   = 'Steve'
    @sprite = 'nerd'
    @hitbox = {width: 20, height: 51}

    super

  updateSprite: (frameCount) ->
    switch @state
      when 'walking'
        # Walking frames are 9 through 14
        @spriteIndex = 9 + Math.floor(frameCount / 4) % 6
      when 'talking'
        # Talking frames are 3 and 4
        switch Math.abs(Math.round(Math.cos(frameCount / 10) * 3) % 3)
          when 0 then @spriteIndex = 0
          when 1 then @spriteIndex = 2
          when 2 then @spriteIndex = 3
      else
        # Idle automation
        f = Math.floor(frameCount / 3) % 30
        @spriteIndex = 0 if f <= 12
        @spriteIndex = 1 if f == 13
        @spriteIndex = 2 if f == 14
        @spriteIndex = 3 if f == 15
        @spriteIndex = 4 if 16 <= f <= 20
        @spriteIndex = 5 if 21 <= f <= 30

  clickAction: ->
    # # Round 1
    if @game.currentRound is 0
      {x, y} = @position
      @game.hero.walkTo x - 25, y, =>
        @game.isLocked = yes
        @direction           = 'left'
        @game.hero.direction = 'right'

        @say "Skyrim bla bla bla", =>
          @say "Dragon born bla bla bla", =>
           @say "Dhovakin bla bla bla", =>
             @say "Thu'um bla bla bla", =>
               @say "Thieves guild bla bla bla", =>
                 @say "better than Oblivion", =>
                   @say "Mammoth bla bla bla", =>
                     @say "<spoiler alert>", =>
                       @say "Main quest ends in Sovngarde", =>
                         @say "</spoiler alert>", =>
                           @say "Dragons bla bla bla", =>
                             @game.isLocked = no
