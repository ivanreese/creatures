# MATH

TAU = Math.PI * 2

phasor = (min, max, cycles = 1)->
  (phase)->
    (Math.sin(TAU * phase * cycles)/2 + 0.5) * (max - min) + min

lerp = (i, im, iM, om, oM)->
  i -= im
  i /= (iM - im)
  i *= (oM - om)
  i += om
  i

# SVG

attr = (elm, k, v)->
  if v?
    elm.setAttribute k, v
    v
  else
    elm.getAttribute k

move = (elm, x, y = 0)->
  elm._trs ?= []
  elm._trs[0] = "translate(#{x}, #{y})"
  attr elm, "transform", elm._trs.join " "
  elm # Support chaining

scale = (elm, x, y = x)->
  elm._trs ?= []
  elm._trs[2] = "scale(#{x}, #{y})"
  attr elm, "transform", elm._trs.join " "
  elm # Support chaining

grey = (elm, l)->
  attr elm, "fill", "hsl(0, 0%, #{l}%)"
