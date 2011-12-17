if DEBUG
  LOG = -> console.log arguments...
else
  LOG = ->

window.requestAnimationFrame ||= (callback, element) ->
                                   window.setTimeout callback, 1000 / 25

Settings =
  mainCanvasID: 'main'
