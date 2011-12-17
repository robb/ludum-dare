class Game
  constructor: ->
    hero    = new Hero
    emo     = new Emo
    pothead = new Pothead
    hipster = new Hipster

    @actors = [
      pothead,
      hero,
      emo,
      hipster
    ]

    hero.position = x: 52, y: 95
    hero.target   = x: 502, y: 95

    emo.position     = emo.target     = x:  32, y: 94
    pothead.position = pothead.target = x: 300, y: 97
    hipster.position = hipster.target = x: 124, y: 95

