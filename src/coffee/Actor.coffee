class Actor
  constructor: ->
    @position    = {x: 0, y: 0}
    @target      = {x: 0, y: 0}
    @direction   = 'right'
    @state       = 'default'
    @spriteIndex = 0
    @speed       = 3

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
      if -@speed < @position.x - @target.x < @speed
        @position.x = @target.x
      else if @position.x < @target.x
        @position.x += @speed
      else
        @position.x -= @speed

      if -@speed < @position.y - @target.y < @speed
        @position.y = @target.y
      else if @position.y < @target.y
        @position.y += @speed
      else
        @position.y -= @speed


  animate: (frameCount) ->
    # TODO: animate
