Take "Tentacle", (Tentacle)->
  Tentacle(50)

Take ["update", "SVG", "math", "stage"],
  (update, SVG, math, stage)->
    lerp = math.lerp
    phasor = math.phasor
    gauss = math.gauss
    ramp = math.ramp
    primeN = math.primeN
    rotateN = math.rotateN
    move = SVG.move
    rotate = SVG.rotate
    scale = SVG.scale
    grey = SVG.grey
    rnd = (c=0.5,s=1)-> lerp c-s/2, c+s/2, Math.random()
    
    d = "M-41,-1 C-43,-51 43,-52 41,2 L38,60 C21,101 -20,101 -36,61 Z"
    
    makeCircle = (parent, rc, rs, xc, xs, yc, ys, g)->
      scale (grey (move (SVG.create "circle", r: rnd(rc,rs), parent), rnd(-xc,xs), rnd(yc,ys)), g), rnd(1, 0.1), rnd(1, 0.1)
      scale (grey (move (SVG.create "circle", r: rnd(rc,rs), parent), rnd(+xc,xs), rnd(yc,ys)), g), rnd(1, 0.1), rnd(1, 0.1)
    
    makeSeg = (parent, g)->
      grey (SVG.create "path", {d:d}, parent), g
    
    mouse = {x:0, y:0}
    
    document.addEventListener "mousemove", (e)->
      mouse.x = e.clientX - stage.hWidth
      mouse.y = e.clientY - stage.hHeight
    
    Make "Tentacle", (length)->
      containers = []
      
      parent = root = SVG.create "g"
      move root, 0, -stage.hHeight
      
      makeCircle parent, 25, 3, 27, 2, 10, 2, 0.23
      makeCircle parent, 24, 2, 25, 2, 60, 2, 0.22
      makeSeg parent, 0.2
      
      for i in [0...length]
        container = SVG.create "g", null, parent
        move container, rnd(), rnd(50)
        scale container, rnd(0.90, 0.02), rnd(0.92, 0.02)
        container._phase = Math.random() * 10
        parent = container
        containers.push container
        
        lightness = lerp 0.2, 0, i / (length-1) + (phasor 0.05, -0.05, 8, i/(length-1))
        lightness += Math.pow(1-i/length-1, 4)
        makeCircle parent, 22, 2, 24, 2, 60, 2, lightness + 0.02
        makeSeg parent, lightness
      
      update (t, dt)->
        for container, i in containers
          iN = i/(length-1)
          
          maxAngle = phasor 0, 0.05, 1-iN, t/50 + container._phase
          angle = gauss -maxAngle, maxAngle, t/10 + container._phase
          rotate container, angle
        
