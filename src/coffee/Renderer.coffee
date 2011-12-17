class Renderer
  constructor: (@game, callback) ->
    LOG 'Initializing Renderer'

    @mainCanvas = document.getElementById Settings.mainCanvasID
    @mainCanvas.width  = 1024
    @mainCanvas.height = 768
    @mainContext = @mainCanvas.getContext '2d'

    @spriteStore = new SpriteStore =>
      LOG 'Sprite store callback executed'

      @actorLayer = new ActorLayer @, @game

      callback?()

  joinLayers: ->
    join = (layer, alpha = 1.0) =>
      @mainContext.drawImage layer.canvas, 0, 0

    @clear @mainContext

    join @actorLayer

  clear: (context) ->
    context.clearRect 0, 0, Settings.canvasWidth, Settings.canvasHeight

  render: ->
    @actorLayer.redraw()

    @joinLayers()
