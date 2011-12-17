class Layer
  constructor: (@renderer) ->
    @canvas = document.createElement 'canvas'
    @canvas.width  = 1024
    @canvas.height = 748
    @context = @canvas.getContext '2d'

  getSprite: (type, name, index = 0) ->
    @renderer.spriteStore.getSprite type, name, index = 0

  clear: ->
    @context.clearRect 0, 0, Settings.canvasWidth, Settings.canvasHeight

  redraw: ->
