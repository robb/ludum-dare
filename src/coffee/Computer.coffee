class Computer extends Entity
  constructor: ->
    @name   = 'MacBook Air'
    @sprite = 'computer'
    @hitbox = {width: 19, height: 34}

    super

  clickAction: ->
    @game.hero.walkTo @position.x - 25, @position.y - 4, =>
      @game.hero.direction = 'right'
      @game.hero.say "Only two pixels thick,
                      it's the thinnes and lightest in the industry."
