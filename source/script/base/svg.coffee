Take "stage", (stage)->
  svgNS = "http://www.w3.org/2000/svg"
  root = document.querySelector "svg"
  container = document.createElementNS svgNS, "g"
  root.appendChild container
  
  Make "SVG", SVG =
    create: (type, init, parent = container)->
      elm = document.createElementNS svgNS, type
      SVG.prependChild parent, elm
      for k, v of init
        SVG.attr elm, k, v
      elm
    
    prependChild: (parent, child)->
      if parent.hasChildNodes()
        parent.insertBefore child, parent.firstChild
      else
        parent.appendChild child
    
    attr: (elm, k, v)->
      if v?
        elm.setAttribute k, v
        v
      else
        elm.getAttribute k
    
    move: (elm, x, y = 0)->
      elm._trs ?= []
      elm._trs[0] = "translate(#{x}, #{y})"
      SVG.attr elm, "transform", elm._trs.join " "
      elm # Support chaining
    
    rotate: (elm, r)->
      elm._trs ?= []
      elm._trs[1] = "rotate(#{r*360})"
      SVG.attr elm, "transform", elm._trs.join " "
      elm # Support chaining
    
    scale: (elm, x, y = x)->
      elm._trs ?= []
      elm._trs[2] = "scale(#{x}, #{y})"
      SVG.attr elm, "transform", elm._trs.join " "
      elm # Support chaining
    
    grey: (elm, l)->
      SVG.attr elm, "fill", "hsl(0, 0%, #{l*100}%)"
  
  stage.onResize (w, h, hW, hH)->
    SVG.attr container, "transform", "translate(#{hW}, #{hH})"
