class Couch extends Entity
  constructor: ->
    @name   = 'Couch'
    @sprite = 'couch'
    @hitbox = {width: 77, height: 35}

    super

  clickAction: ->
    @game.hero.walkTo @position.x - 20, @position.y + 2, =>
      @game.hero.direction = 'right'
      @game.hero.say "Hmm, looks comfy"
