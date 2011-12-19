class SpriteStore
  constructor: (callback) ->
    LOG 'Initializing SpriteStore'

    # Initialize empty sprite store
    @sprites = {}

    assets = 0
    # Count number of files synchroniously
    for group, sprites of SpriteStore.Assets
      assets++ for own name of sprites

    LOG "Found #{assets} assets"

    for own group, sprites of SpriteStore.Assets
      LOG "Loading #{group}"

      @sprites[group] = {}
      for own name, sprite of sprites
        do (group, name, sprite) =>
          LOG "Loading #{group}/#{name}"

          @sprites[group][name] = []
          {width, height}    = sprite.size
          spriteImage        = new Image
          spriteImage.onload = =>
            LOG "Loaded #{name}"

            spriteCount = sprite.spriteCount or 1

            for index in [0...spriteCount]
              canvas = document.createElement 'canvas'
              canvas.width  = width
              canvas.height = height
              context = canvas.getContext '2d'

              try
                context.drawImage spriteImage,
                                  index * width, 0, width, height,
                                              0, 0, width, height

                @sprites[group][name][index] = canvas

                LOG "@sprites[#{group}][#{name}][#{index}]"
              catch error
                LOG "Encountered error #{error} while loading sprite: #{sprite}"
                LOG "Sprite file may be too small" if error.name is "INDEX_SIZE_ERR"
                break

            # Execute callback after loading the last asset
            callback?() if --assets is 0

          spriteImage.src    = "/img/#{group}/#{name}.png"

  getSprite: (group, name, index = 0) ->
    unless sprite = @sprites[group]?[name]?[index]
      throw "Could not load #{name}[#{index}] in #{group}"
    else
      sprite

  # Describes all assets
  @Assets:
    'entities':
      # Students
      'pothead':
        size:    {width: 31, height: 50}

      'emo':
        size:        {width: 28, height: 59}
        spriteCount: 13

      'hipster':
        size:        {width: 27, height: 55}
        spriteCount: 5

      'hero':
        size:        {width: 27, height: 56}
        spriteCount: 13

      'guidette':
        size:        {width: 30, height: 55}
        spriteCount: 30

      'student':
        size:        {width: 20, height: 51}
        spriteCount: 17

      'nerd':
        size:        {width: 20, height: 51}
        spriteCount: 18

      # Objects
      'stereo':
        size: {width: 23, height: 29}

      'couch':
        size: {width: 77, height: 34}

      'computer':
        size:        {width: 19, height: 34}
        spriteCount: 2

#      'cactus':
#        size:    {width: 31, height: 50}
#
#      'entrance-door':
#        size:    {width: 31, height: 50}
#
#      'bedroom-door':
#        size:    {width: 31, height: 50}
#
#      'bathroom-door':
#        size:    {width: 31, height: 50}
#
#      'poster':
#        size:    {width: 31, height: 50}
#
#      'lamp':
#        size:    {width: 31, height: 50}
#
#      'table':
#        size:    {width: 31, height: 50}
#
#      'speaker':
#        size:    {width: 31, height: 50}
#
#      'rug':
#        size:    {width: 31, height: 50}
#
#      'plant':
#        size:    {width: 31, height: 50}
#
#      'mop':
#        size:    {width: 31, height: 50}
#
#      'uplight':
#        size:    {width: 31, height: 50}
#
#      'kitchen-chair':
#        size:    {width: 31, height: 50}
#
#      'clock':
#        size:    {width: 31, height: 50}
#
#      'beer-crates':
#        size:    {width: 31, height: 50}
#
#      'plant-pot':
#        size:    {width: 31, height: 50}
#
#      'moon':
#        size:    {width: 31, height: 50}

    'backgrounds':
      'flat-background':
        size: {width: 746, height: 163}

      'flat-foreground':
        size: {width: 746, height: 163}

#      'bathroom':
#        size: {width: 1024, height: 748}
#        file: 'bathroom.png'
