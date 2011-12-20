class Game
  constructor: ->
    # The game consists of 5 rounds
    @currentRound = 0

    # Actors
    @hero     = new Hero     @
    @emo      = new Emo      @
    @hipster  = new Hipster  @
    @guidette = new Guidette @
    @student  = new Student  @
    @nerd     = new Nerd     @
    @princess = new Princess @
#
    # Objects
    @stereo                  = new Stereo       @
    @couch                   = new Couch        @
    @computer                = new Computer     @
#    @cactus                  = new Cactus       @
#    @entranceDoor            = new EntranceDoor @
#    @bedroomDoor             = new BedroomDoor  @
#    @bathroomDoor            = new BathroomDoor @
#    @poster                  = new Poster       @
#    @lamp                    = new Lamp         @
#    @table                   = new Table        @
#    @speaker                 = new Speaker      @
#    @otherSpeaker            = new Speaker      @
#    @yetAnotherSpeaker       = new Speaker      @
#    @oMyGodItsFullOfSpeakers = new Speaker      @
#    @otherSpeaker            = new Speaker      @
#    @rug                     = new Rug          @
#    @plant                   = new Plant        @
#    @mop                     = new Mop          @
#    @uplight                 = new Uplight      @
#    @chair                   = new KitchenChair @
#    @otherChair              = new KitchenChair @
#    @clock                   = new Clock        @
#    @beerCrates              = new BeerCrates   @
#    @plantPot                = new PlantPot     @
#    @moon                    = new Moon         @
#    @keyHole                 = new KeyHole      @

    @entities = [
      # Actors
      @hero,
      @emo,
      @hipster,
      @guidette,
      @student,
      @nerd,
      @princess,
#
      # Objects
      @stereo,
      @couch,
      @computer,
#      @cactus,
#      @entranceDoor,
#      @bedroomDoor,
#      @bathroomDoor,
#      @poster,
#      @lamp,
#      @table,
#      @speaker,
#      @otherSpeaker,
#      @yetAnotherSpeaker,
#      @oMyGodItsFullOfSpeakers,
#      @otherSpeaker,
#      @rug,
#      @plant,
#      @mop,
#      @uplight,
#      @chair,
#      @otherChair,
#      @clock,
#      @beerCrates,
#      @plantPot,
#      @moon,
#      @keyHole
    ]


    # Set up entities
    @hero.position     = x:  52, y: 145
    @princess.position = x: 202, y: 143
    @emo.position      = x: 642, y: 144
    @emo.state         = 'smoking'
    @hipster.position  = x: 333, y: 150
    @hipster.state     = 'typing'

    @guidette.position = x: 262, y: 142

    @student.position  = x: 462, y: 147
    @student.direction = 'left'
    @student.sate      = 'talking'

    @nerd.position     = x: 535, y: 142

    @stereo.position   = x: 314, y: 139
    @computer.position = x: 332, y: 155
    @couch.position    = x: 160, y: 140
