Take "resize", (resize)->
  svgns = "http://www.w3.org/2000/svg"
  svg = document.querySelector "svg"
  root = document.createElementNS svgns, "g"
  svg.appendChild root
  
  resize (w, h)->
    attr root, "transform", "translate(#{w/2}, #{h/2})"
  
  Make "svg",
    create: (type, init, parent = root)->
      elm = document.createElementNS svgns, type
      parent.appendChild elm
      
      for k, v of init
        attr elm, k, v
        
      elm
