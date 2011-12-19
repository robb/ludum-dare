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
                throw "#{name} : #{error}"
                break

            # Execute callback after loading the last asset
            callback?() if --assets is 0

          spriteImage.src    = "/img/#{group}/#{sprite.file}"

  getSprite: (group, name, index = 0) ->
    unless sprite = @sprites[group]?[name]?[index]
      throw "Could not load #{name}[#{index}] in #{group}"
    else
      sprite

  # Describes all assets
  @Assets:
    'entities':
      'pothead':
        size:    {width: 31, height: 50}
        file:    'pothead.png'

      'emo':
        size:        {width: 28, height: 59}
        file:        'emo.png'
        spriteCount: 13

      'hipster':
        size:        {width: 27, height: 55}
        file:        'mitte-hipster.png'
        spriteCount: 5

      'hero':
        size:        {width: 27, height: 56}
        file:        'hero.png'
        spriteCount: 8

      'guidette':
        size:        {width: 30, height: 46}
        file:        'guidette.png'
        spriteCount: 16

      'stereo':
        size: {width: 23, height: 29}
        file: 'stereo.png'

      'couch':
        size: {width: 77, height: 34}
        file: 'couch.png'

      'computer':
        size:        {width: 19, height: 34}
        file:        'computer.png'
        spriteCount: 2

    'backgrounds':
      'flat-background':
        size: {width: 839, height: 163}
        file: 'flat-background.png'

      'flat-foreground':
        size: {width: 255, height: 162}
        file: 'flat-foreground.png'

#      'bathroom':
#        size: {width: 1024, height: 748}
#        file: 'bathroom.png'
