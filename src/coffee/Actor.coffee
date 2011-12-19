class Actor extends Entity
  constructor: ->
    @direction ?= 'right'
    @speed     ?= {x: 3, y: 0.7}

    @action    ?= null

    super

  walkTo: (x, y, next) ->
    @state = 'walking' unless @position.x is x and @position.y is y

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

  say: (text, next) ->
    @state = 'talking'

    wordCount = text.split(' ').length

    @action = (frameCount) =>
      LOG "#{@name}: #{text}"

      $('#speech').css top: @position.y - 100, left: @position.x - 50


      $('#speech').text text
      @action = null
      setTimeout =>
        @state  = 'default'
        $('#speech').text ''

        @action = next
      , 500 * wordCount

  performAction: (frameCount) ->
    @action?(frameCount)

  resetActions: ->
    @actionQueue = []
