Take ["Worm", "math"], (Worm, math)->
  return
  nWorms = 10
  worms = for i in [0...nWorms]
    Worm i/(nWorms-1)

Take ["update", "SVG", "math"],
  (update, SVG, math)->
    lerp = math.lerp
    phasor = math.phasor
    grey = SVG.grey
    
    Make "Worm", (ageN)->
      localTime = Math.random()
      goal = x: 0, y: 0
      
      lengthN = Math.random()
      length = lerp 10, 100, lengthN
      
      greyPr = phasor lerp(.06, .16, ageN), lerp(.16, .24, ageN), lerp(1.5, 0.5, ageN)
      scalePr = phasor lerp(6, 10, ageN), lerp(7, 16, ageN), 2
      speedPr = phasor lerp(0, 0, ageN), lerp(0.5, 3, ageN * lengthN), 2
      
      segs = for i in [0...length]
        seg = SVG.create "circle", r: 1
        seg._y = seg._x = 0
        grey seg, greyPr i/length
        seg
      
      newGoal = ()->
        goal =
          x: Math.random() * 500 - 250
          y: Math.random() * 500 - 250
      
      update (t, dt)->
        localTime += dt
        
        seg = segs[0]
        
        if seg._x is goal.x and seg._y is goal.y
          newGoal()
        
        for seg, i in segs
          segN = i/(length-1)
                  
          scale = scalePr(localTime - segN)
          SVG.scale seg, lerp(scale, scale * 3/4, segN)
          
          speed = speedPr -segN + localTime
          
          if i is 0
            dx = goal.x - seg._x
            dy = goal.y - seg._y
            angle = Math.atan2(dy, dx)
            seg._x += Math.cos(angle) * Math.min(speed, Math.abs(dx))
            seg._y += Math.sin(angle) * Math.min(speed, Math.abs(dy))
          else
            last = segs[i-1]
            dx = last._x - seg._x
            dy = last._y - seg._y
            angle = Math.atan2(dy, dx)
            if Math.abs(dx) > speed
              seg._x += Math.cos(angle) * speed
            if Math.abs(dy) > speed
              seg._y += Math.sin(angle) * speed
            
          SVG.move seg, seg._x, seg._y
