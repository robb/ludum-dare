class Game
  constructor: ->
    # Actors
    @hero     = new Hero     @
    @emo      = new Emo      @
    @pothead  = new Pothead  @
    @hipster  = new Hipster  @
    @guidette = new Guidette @

    # Objects
    @stereo = new Stereo @

    @entities = [
      @pothead,
      @emo,
      @guidette,
      @hero,
      @hipster,
      @stereo
    ]

    # Set up entities
    @hero.position     = x:  52, y: 145
    @emo.position      = x:  32, y: 144
    @emo.state         = 'talking'
    @pothead.position  = x: 300, y: 142
    @hipster.position  = x: 124, y: 150
    @hipster.state     = 'typing'

    @guidette.position = x: 262, y: 142
    @stereo.position   = x: 402, y: 140

    @emo.walkTo 180, 147, =>
      @emo.walkTo 20, 147
