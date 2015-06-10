Take "Plankton", (Plankton)->
  nPlankton = 5
  for i in [0...nPlankton]
    Plankton(i/(nPlankton-1))

Take ["update", "SVG", "math", "stage"],
  (update, SVG, math, stage)->
    lerpN = math.lerpN
    lerpNEW = math.lerpNEW
    phasor = math.phasor
    gauss = math.gauss
    ramp = math.ramp
    primeN = math.primeN
    rotateN = math.rotateN
    move = SVG.move
    rotate = SVG.rotate
    
    Make "Plankton", (ageN)->
      body = SVG.create "g"
      
      time = 0
      
      energy = lerpN ageN, 1, 1/300
      
      rhythmP = Math.random()
      xRhythm = lerpNEW 4, 8, primeN(rhythmP)
      yRhythm = lerpNEW 4, 8, primeN(rotateN rhythmP, Math.random()/4 + 0.25)
      
      chaos = ramp 1, 0, ageN
      
      rotationP = Math.random()
      
      spreadMin = 5
      spreadMax = 50
      spreadAge = lerpNEW spreadMin, spreadMax, ageN
      
      nPieces = lerpNEW 3, 200, ageN
      
      # SETUP
      pieces = for pieceI in [0...nPieces]
        nPoints = Math.round(lerpN Math.random(), 3, 6)
        
        points = for i in [0...nPoints]
          iF = i/nPoints
          angle = iF * math.TAU
          x = Math.cos(angle + Math.random() - 0.5) * (nPoints/3 + Math.random())
          y = Math.sin(angle + Math.random() - 0.5) * (nPoints/3 + Math.random())
          x + "," + y
        
        piece = SVG.create "polygon", {points:points.join(" ")}, body
        SVG.grey piece, ageN
        piece._r = Math.random()
        piece
      
      # UPDATE
      update (t, dt)->
        time += dt * energy
        
        for piece, pieceI in pieces
          pieceN = pieceI/(nPieces-1)
          
          pieceSpread = gauss spreadMin, spreadAge, pieceN
          
          xP = pieceN * xRhythm - time + piece._r * chaos
          yP = pieceN * yRhythm + time + piece._r * chaos
          
          x = gauss -pieceSpread, pieceSpread, xP
          y = gauss -pieceSpread, pieceSpread, yP
          
          move piece, x, y

          rotate piece, rotationP + time
      
      # RESIZE
      stage.onResize (w, h, hW, hH)->
        y = lerpN ageN, 50 - hH, hH - 100
        move body, 0, y
