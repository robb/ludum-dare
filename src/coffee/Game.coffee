class Game
  constructor: ->
    @hero     = new Hero     @
    @emo      = new Emo      @
    @pothead  = new Pothead  @
    @hipster  = new Hipster  @
    @guidette = new Guidette @

    @actors = [
      @pothead,
      @emo,
      @guidette
      @hero,
      @hipster
    ]

    @hero.position = x:  52, y: 145
    @hero.target   = x: 102, y: 150

    @emo.position      = @emo.target      = x:  32, y: 144
    @emo.state = 'talking'

    @pothead.position  = @pothead.target  = x: 300, y: 142

    @hipster.position  = @hipster.target  = x: 124, y: 150
    @hipster.state     = 'typing'

    @guidette.position = @guidette.target = x: 262, y: 142

    setTimeout =>
      @hero.target = x: 232, y: 142
    , 4200

    setTimeout =>
      @hero.target = x:  52, y: 145
    , 8500

    setTimeout =>
      @emo.target = x: 180, y: 147
    , 9200
