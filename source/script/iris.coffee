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
    
    Take "Iris", (Iris)->
      Iris()
    
    makeVein = (phase, startY, endY, nPoints, wobbling, wiggling)->
      x = 0
      y = startY
      parts = ["M#{x},#{y}"]
      wiggle = wiggling * gauss 0.1, 10, phase
      for p in [1...nPoints]
        pN = p/(nPoints-1)
        pNmid = (p-0.5)/(nPoints-1)
        xmid = phasor -wobbling/5, wobbling/5, wiggle, pNmid
        ymid = lerp startY, endY, pNmid
        wobble = phasor 0.5, 2, wiggle, pN
        xWobble = phasor -wobbling, wobbling, wobble, pN
        baseX = rnd(Math.pow(pN, 4), wiggle)
        x = gauss baseX, xWobble, pN
        y = lerp startY, endY, pN
        parts.push "S#{xmid},#{ymid} #{x},#{y}"
      
      return parts.join " "
    
    makeLayer = (parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)->
      for i in [0...nVeins]
        iN = i/(nVeins-1)
        iF = i/nVeins
        sY = rnd(startY, startY/2)
        eY = rnd(endY, endY/3)
        nP = rnd(nPoints, nPointsR)|0
        options =
          d: makeVein(iN, sY, eY, nP, wobbling, wiggling)
          fill: "none"
          stroke: stroke
          "stroke-width": rnd(width, widthR)
          "stroke-linecap": "round"
        vein = SVG.create "path", options, parent
        rotate vein, rnd(iF, angleR)
    
    Make "Iris", (parent)->
      
      SVG.createRadialGradient("glowFG", true, "hsla(46,96%,73%,0.1)", "hsla(240,100%,70%,0.2)", "hsla(240,100%,70%,0)")
      SVG.createRadialGradient("glowBG", true, "hsla(46,96%,73%,0.8)", "hsla(240,100%,70%,0)")
      SVG.createGradient("singe", true, "#F42614", "#FEE070", "#EAB46F", "#775A45", "#3D2A0F")
            
      # MIDDLE FIRE-SMOKEY
      nVeins = 100
      startY = 50
      endY = 150
      nPoints = 10
      nPointsR = 4
      wobbling = 2
      wiggling = .5
      width = 2
      widthR = 1.4
      stroke = "url(#singe)"
      angleR = 0.1
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
      
      # FOREGROUND OUTER GLOW
      SVG.create "circle", {r: 400, fill:"url(#glowFG)"}

      # CENTER BLACK
      nVeins = 60
      startY = 30
      endY = 50
      nPoints = 5
      nPointsR = 3
      wobbling = 0.8
      wiggling = 0
      width = 3
      widthR = 2
      stroke = "#020603"
      angleR = 0.03
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
      
      # OUTER ORANGE/PINK
      nVeins = 100
      startY = 40
      endY = 200
      nPoints = 10
      nPointsR = 4
      wobbling = 5
      wiggling = 1
      width = 1.5
      widthR = 1.4
      stroke = "#E15B2C"
      angleR = 0.1
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
      
      # OUTER DARK RED
      nVeins = 100
      startY = 40
      endY = 200
      nPoints = 10
      nPointsR = 4
      wobbling = 5
      wiggling = 1
      width = 1.5
      widthR = 1.4
      stroke = "#AD3D20"
      angleR = 0.1
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
      
      # BACKGROUND WHITE
      nVeins = 100
      startY = 60
      endY = 100
      nPoints = 10
      nPointsR = 4
      wobbling = 1
      wiggling = .2
      width = 4
      widthR = 2
      stroke = "#FEE5BD"
      angleR = 0.1
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
      
      # BACKGROUND RED
      nVeins = 100
      startY = 50
      endY = 150
      nPoints = 10
      nPointsR = 4
      wobbling = 5
      wiggling = 2
      width = 5
      widthR = 2
      stroke = "#AE2522"
      angleR = 0.1
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
      
      # CENTER LIGHT BROWN
      nVeins = 20
      startY = 15
      endY = 40
      nPoints = 5
      nPointsR = 3
      wobbling = 5
      wiggling = 4
      width = 2
      widthR = 1
      stroke = "#600403"
      angleR = 0.03
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
      
      # CENTER BROWN
      SVG.create "circle", {r: 50, fill:"#500202"}
      
      # MIDDLE RED
      SVG.create "circle", {r: 120, fill:"#FF0000"}
      
      # OUTER GLOW
      SVG.create "circle", {r: 300, fill:"url(#glowBG)"}
      
      # BACKGROUND BLACK THICK
      nVeins = 100
      startY = 200
      endY = 300
      nPoints = 20
      nPointsR = 3
      wobbling = 3
      wiggling = 0.2
      width = 10
      widthR = 2
      stroke = "#020603"
      angleR = 0.03
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)

      # BACKGROUND BLACK MEDIUM
      nVeins = 250
      startY = 200
      endY = 300
      nPoints = 20
      nPointsR = 3
      wobbling = 3
      wiggling = 0.2
      width = 5
      widthR = 2
      stroke = "#020603"
      angleR = 0.03
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)

      # BACKGROUND BLACK THIN
      nVeins = 250
      startY = 200
      endY = 350
      nPoints = 20
      nPointsR = 3
      wobbling = 3
      wiggling = 0.2
      width = 2
      widthR = 1.9
      stroke = "#020603"
      angleR = 0.03
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)

      # BACKGROUND BLACK HAIRLINE
      nVeins = 250
      startY = 250
      endY = 350
      nPoints = 20
      nPointsR = 3
      wobbling = 3
      wiggling = 0.2
      width = 0.5
      widthR = 0
      stroke = "#020603"
      angleR = 0.03
      makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR)
