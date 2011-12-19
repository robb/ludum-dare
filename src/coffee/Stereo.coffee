class Stereo extends Entity
  constructor: ->
    @name   = 'Home Stereo'
    @sprite = 'stereo'
    @hitbox = {width: 23, height: 29}

    super

  clickAction: ->
    @game.hero.walkTo @position.x - 20, @position.y + 2, =>
      @game.hero.direction = 'right'
      @game.hero.say "Wow, what a dusty stereo!", =>
        @game.hero.say "Looks like there is something in the CD drive", =>
