class Renderer
  constructor: (@game, callback) ->
    LOG 'Initializing Renderer'

    @mainCanvas = document.getElementById Settings.mainCanvasID
    @mainCanvas.width  = 1024
    @mainCanvas.height = 768
    @mainContext = @mainCanvas.getContext '2d'

    @spriteStore = new SpriteStore =>
      LOG 'Sprite store callback executed'

      @backgroundLayer = new BackgroundLayer @
      @entityLayer     = new EntityLayer     @, @game

      @layers = [
        @backgroundLayer, @entityLayer
      ]

      callback?()

  joinLayers: ->
    join = (layer, alpha = 1.0) =>
      @mainContext.drawImage layer.canvas, 0, 0

    @clear @mainContext

    join layer for layer in @layers

  clear: (context) ->
    context.clearRect 0, 0, Settings.canvasWidth, Settings.canvasHeight

  render: ->
    layer.redraw() for layer in @layers when layer.needsRedraw

    @joinLayers()
