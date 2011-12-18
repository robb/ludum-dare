class Actor extends Entity
  constructor: ->
    @direction ?= 'right'
    @speed     ?= {x: 3, y: 0.7}

    @action    ?= null

    super

  walkTo: (x, y, next) ->
    @state = 'walking'

    @action = (frameCount) =>
      if @position.x is x and @position.y is y
        @action = null
        @state  = 'default'
        next?()
        return

      if @position.x < x
        @direction = 'right'
      else
        @direction = 'left'

      # Every @speed frames, move towards the target
      if frameCount % 2 is 0
        if -@speed.x < @position.x - x < @speed.x
          @position.x = x
        else if @position.x < x
          @position.x += @speed.x
        else
          @position.x -= @speed.x

        if -@speed.y < @position.y - y < @speed.y
          @position.y = y
        else if @position.y < y
          @position.y += @speed.y
        else
          @position.y -= @speed.y

  performAction: (frameCount) ->
    @action?(frameCount)

  resetActions: ->
    @actionQueue = []
