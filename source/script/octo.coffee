Take ["update", "SVG", "math", "stage", "Tentacle"],
  (update, SVG, math, stage, Tentacle)->
    return
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
    group = (parent)-> SVG.create "g", null, parent
    rnd = (c=0.5,s=1)-> lerp c-s/2, c+s/2, Math.random()
    
    d = "M-41,-1 C-43,-51 43,-52 41,2 L38,60 C21,101 -20,101 -36,61 Z"
    
    Take "Octo", (Octo)->
      o = Octo(0.5).root
      # move o, 0, -200
    
    makeBody = (parent, size, lightness)->
      parts = []
      points = lerp 5, 21, size
      for i in [0...points]
        angle = i/points * math.TAU
        x = Math.round (Math.sin angle) * gauss 50, 200, i/points
        y = Math.round (Math.cos angle) * gauss 50, 200, i/points
        if i is 0
          parts.push "M#{x},#{y}"
        else
          parts.push "T#{x},#{y}"
      parts.push "Z"
      body = SVG.create "path", {d:parts.join " "}, parent
      grey body, lightness
      body
      
    
    Make "Octo", (size)->
      root = group()
      scale root, lerp 0.02, 1, size
      # SVG.create "circle", r: 10, root
      body = makeBody(root, size, 0.22)
      
      nTentacles = Math.round lerp 3, 8, Math.pow(size,2)
      for i in [0...nTentacles]
        iN = i/(nTentacles-1) or 0
        t = Tentacle(root, size).root
        
        spread = lerp rnd(1.7), 1, size
        angle = lerp -spread, spread, iN
        x = Math.sin(angle) * 120
        y = Math.cos(angle) * 40
        move t, x, y
        
        angleSpread = lerp rnd(spread/10, 0.2), spread/5, Math.pow(size,1/2)
        rotate t, phasor angleSpread, -angleSpread, 0.25, iN-0.5
        scale t, lerp rnd(1, 0.2), 0.5, size
      
      update (t, dt)->
        x = gauss -100, 100, t/17
        y = gauss -100, -200, t/27
        move root, x, y
        
        wiggleMax = lerp 0, 0.02, 1, t/37
        wiggleAngle = gauss -wiggleMax, wiggleMax, t/19
        rotate root, wiggleAngle
      
      return octo =
        root: root
