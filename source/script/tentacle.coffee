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
    
    makeContainer = (parent)->
      container = SVG.create "g", null, parent
      container._phase = Math.random() * 1000
      container

    makeCircle = (parent, rc, rs, xc, xs, yc, ys, g)->
      left = SVG.create "circle", r: rnd(rc,rs), parent
      right = SVG.create "circle", r: rnd(rc,rs), parent
      move left, rnd(-xc,xs), rnd(yc,ys)
      move right, rnd(+xc,xs), rnd(yc,ys)
      grey left, g
      grey right, g
      scale left, rnd(1, 0.1), rnd(1, 0.1)
      scale right, rnd(1, 0.1), rnd(1, 0.1)
    
    makeSeg = (parent, g)->
      grey (SVG.create "path", {d:d}, parent), g
    
    mouse = {x:0, y:0}
    
    document.addEventListener "mousemove", (e)->
      mouse.x = e.clientX - stage.hWidth
      mouse.y = e.clientY - stage.hHeight
    
    Make "Tentacle", (owner, size)->
      maxLength = 50
      
      length = lerp 30, maxLength, Math.random()
      
      containers = []
      
      parent = root = makeContainer(owner)
      scale root, size
      
      makeCircle parent, 25, 3, 27, 2,  0, 2, 0.23
      makeCircle parent, 24, 2, 25, 2, 60, 2, 0.22
      makeSeg parent, 0.2
      
      suckerSegs = Math.sqrt(size) * 50 - 10
      
      for i in [0...length]
        iN = i/(length-1)
        iM = i/(maxLength-1)
        
        parent = container = makeContainer(parent)
        containers.push container
        move container, rnd(), rnd(60)
        scale container, rnd(0.92, 0.02), rnd(0.95, 0.02)
        
        lightness = lerp 0.2, 0, iM + (phasor 0.05, -0.05, 8, iM)
        lightness += Math.pow(iM, 4)
        
        if i < suckerSegs
          makeCircle parent, 22, 2, 24, 2, 60, 2, lightness + 0.02
        
        makeSeg parent, lightness
      
      update (t, dt)->
        for container, i in containers
          iN = i/(length-1)
          wiggleMax = phasor 0, 0.05, 1-iN, t/51 + container._phase
          wiggleAngle = gauss -wiggleMax, wiggleMax, t/13 + container._phase
          curlAngle = (gauss -0.1, 0.1, (t/11 + container._phase)) * Math.sqrt(iN)
          straightTip = lerp 1, 0, iN
          rotate container, (curlAngle + wiggleAngle) * straightTip
      
      return tentacle =
        root: root
