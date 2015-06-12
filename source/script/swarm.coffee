Take "Swarm", (Swarm)->
  nSwarms = 0
  for i in [0...nSwarms]
    Swarm Math.pow i/(nSwarms-1), 8

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
    
    epsilon = 5
    
    randomPoint = ()->
      x: lerp -stage.hWidth + 100,  stage.hWidth - 100,  Math.random()
      y: lerp -stage.hHeight + 100, stage.hHeight - 100, Math.random()

    
    Make "Swarm", (ageN)->
      body = SVG.create "g"
      p = randomPoint()
      body._x = p.x
      body._y = p.y
      body._vx = body._vy = 0
      body._ax = body._ay = 0
      
      goal = randomPoint()
      
      time = Math.random() * 1000
      
      energyGoal = energyMin = 1/10000
      energy = energyMax = lerp 1, 1/300, ageN
      
      updateEnergy = (t)->
          energyRate = phasor 1/10000, energy/10, 1/100000, t
          if energy is energyGoal
            energyGoal = lerp energyMin, energyMax, Math.random()
          else
            dEnergy = (energyGoal - energy)
            if dEnergy > energyRate then dEnergy = energyRate
            if dEnergy < -energyRate then dEnergy = -energyRate
            energy += dEnergy
      
      rhythmP = Math.random()
      rhythmStagger = lerp Math.random(), 0.25, 0.5
      xRhythm = lerp 3, 8, primeN(rhythmP)
      yRhythm = lerp 4, 9, primeN(rotateN rhythmP, rhythmStagger)
      rhythmPr = phasor 0.5, 2, 1
      
      rotationP = Math.random()
      
      spreadMin = 5
      spreadMax = 50
      spreadAge = lerp spreadMin, spreadMax, ageN
      
      nPieces = lerp 3, 500, Math.pow(ageN, 3)
      
      # SETUP
      pieces = for pieceI in [0...nPieces]
        nPoints = Math.round(lerp 3, 6, Math.random())
        
        points = for i in [0...nPoints]
          iF = i/nPoints
          angle = iF * math.TAU
          sizeX = lerp Math.random(), 0.5, 8
          sizeY = lerp Math.random(), 0.5, 8
          x = Math.cos(angle + Math.random() - 0.5) * sizeX
          y = Math.sin(angle + Math.random() - 0.5) * sizeY
          x + "," + y
        
        piece = SVG.create "polygon", {points:points.join(" ")}, body
        piece._seed = Math.random()
        
        SVG.grey piece, gauss ageN, Math.random()/2 + .25, ageN
        
        piece
      
      # UPDATE
      update (t, dt)->
        time += dt * energy
        updateEnergy(time)
        
        # Movement
        if Math.abs(body._x - goal.x) < epsilon and Math.abs(body._y - goal.y) < epsilon
          goal = randomPoint()
          
        dx = goal.x - body._x
        dy = goal.y - body._y
        angle = Math.atan2(dy, dx)
        body._ax = Math.cos(angle) * Math.min(energy/50, Math.abs(dx))
        body._ay = Math.sin(angle) * Math.min(energy/50, Math.abs(dy))
        body._vx += body._ax
        body._vy += body._ay
        body._vx *= 0.999
        body._vy *= 0.999
        body._x += body._vx
        body._y += body._vy
        SVG.move body, body._x, body._y
        
        energy += lerp (Math.abs(dx) + Math.abs(dy)) * 1/50000, 0, Math.pow(ageN, 2)
        
        # Animation
        for piece, pieceI in pieces
          pieceN = pieceI/(nPieces-1)
          
          pieceSpread = gauss spreadMin, spreadAge, pieceN
          
          scattering = (1-ageN) * piece._seed
          xP = pieceN * xRhythm - time + scattering
          yP = pieceN * yRhythm + time + scattering
          
          x = gauss -pieceSpread, pieceSpread, xP
          y = gauss -pieceSpread, pieceSpread, yP
          
          move piece, x, y

          rotate piece, rotationP + time
