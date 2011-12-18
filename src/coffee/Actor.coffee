class Actor
  constructor: (@game) ->
    @position    = {x: 0, y: 0}
    @target      = {x: 0, y: 0}
    @direction   = 'right'
    @state       = 'default'
    @spriteIndex = 0
    @speed       = {x: 3, y: 0.3}

  move: (frameCount) ->
    if @position.x is @target.x and
       @position.y is @target.y
      @state = 'default' if @state is 'walking'

      return

    if @state isnt 'walking'
      @state        = 'walking'
      @walkingStart = frameCount

      if @position.x < @target.x
        @direction = 'right'
      else
        @direction = 'left'

    # Every @speed frames, move towards the target
    if (@walkingStart - frameCount) % 2 is 0
      if -@speed.x < @position.x - @target.x < @speed.x
        @position.x = @target.x
      else if @position.x < @target.x
        @position.x += @speed.x
      else
        @position.x -= @speed.x

      if -@speed.y < @position.y - @target.y < @speed.y
        @position.y = @target.y
      else if @position.y < @target.y
        @position.y += @speed.y
      else
        @position.y -= @speed.y


  animate: (frameCount) ->
    # TODO: animate
