class Computer extends Entity
  constructor: ->
    @name   = 'MacBook Air'
    @sprite = 'computer'
    @hitbox = {width: 19, height: 34}

    super

  clickAction: ->
    @game.hero.walkTo @position.x + 25, @position.y + 2, =>
      @game.hero.direction = 'left'
      @game.hero.say "A MacBook Air!"
