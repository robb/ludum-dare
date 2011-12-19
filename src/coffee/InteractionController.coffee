class InteractionController
  constructor: (@game) ->
    @mainCanvas = document.getElementById Settings.mainCanvasID

    # Set up event handlers
    $(@mainCanvas).on 'click', (event) =>
      event.preventDefault()
      x = event.offsetX or event.pageX - $(@mainCanvas).offset().left
      y = event.offsetY or event.pageY - $(@mainCanvas).offset().top

      # Abort if any NPC is currently executing an action
      return if @game.isLocked

      # If we clicked on an entity, execute its click
      # action and return
      for entity in @game.entities.reverse() when entity.enabled


        if entity.hitTest x, y
          entity.clickAction?()
          return

      # Otherwise, walk over there
      @game.hero.walkTo x, 145
