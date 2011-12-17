if DEBUG
  LOG = -> console.log arguments...
else
  LOG = ->

REQUEST_ANIMATION_FRAME = window.requestAnimationFrame       or
                          window.webkitRequestAnimationFrame or
                          window.mozRequestAnimationFrame    or
                          window.oRequestAnimationFrame      or
                          window.msRequestAnimationFrame     or
                          (callback, element) ->
                            window.setTimeout callback, 1000 / 60

Settings =
  mainCanvasID: 'main'

