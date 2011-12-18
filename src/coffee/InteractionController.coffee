class InteractionController
  constructor: (@game) ->
    @mainCanvas = document.getElementById Settings.mainCanvasID

    # Set up event handlers
    $(@mainCanvas).on 'click', (event) =>
      event.preventDefault()
      x = event.offsetX or event.pageX - $(@mainCanvas).offset().left
      y = event.offsetY or event.pageY - $(@mainCanvas).offset().top

      for entity in @game.entities when entity.enabled
        if entity.hitTest x, y
          entity.clickAction?()
          return

      @game.hero.walkTo x, 145, ->
        LOG "Hero arrived"
