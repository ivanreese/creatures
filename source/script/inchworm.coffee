Take ["Worm", "math"], (Worm, math)->
  return
  oldest = 8
  youngest = 1
  
  worms = for age in [oldest..youngest] # oldest first = oldest on top
    Worm(math.lerp age, youngest, oldest)

Take ["update", "SVG", "math"],
  (update, SVG, math)->
    lerpN = math.lerpN
    phasor = math.phasor
    
    Make "Worm", (ageN)->
      localTime = Math.random()
      goal = x: 0, y: 0
      
      lengthN = Math.random()
      length = lerpN lengthN, 10, 100
      
      greyPr = phasor lerpN(ageN, .06, .16), lerpN(ageN, .16, .24), lerpN(ageN, 1.5, 0.5)
      scalePr = phasor lerpN(ageN, 6, 10), lerpN(ageN, 7, 16), 2
      speedPr = phasor lerpN(ageN, 0, 0), lerpN(ageN * lengthN, 0.5, 3), 2
      
      segs = for i in [0...length]
        seg = SVG.create "circle", r: 1
        seg._y = seg._x = 0
        SVG.grey seg, greyPr i/length
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
          SVG.scale seg, lerpN(segN, scale, scale * 3/4)
          
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
