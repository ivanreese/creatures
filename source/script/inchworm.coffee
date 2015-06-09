Take "Worm", (Worm)->
  worms = for i in [1..8]
    Worm(i * 10)

Take ["resize", "update", "svg"],
  (resize, update, svg)->
    Make "Worm", (segments)->
      t = 0
      goal = x: 0, y: 0
      
      ling = phasor 12, 18, 1
      sing = phasor 14, 17, 2
      sping = phasor 0, segments/20, 2
      
      segs = for i in [0...segments]
        seg = svg.create "circle", r: 1
        seg._y = seg._x = 0
        grey seg, ling i/segments
        seg
      
      newGoal = ()->
        goal =
          x: Math.random() * 500 - 250
          y: Math.random() * 500 - 250
      
      update (dt)->
        t += dt
        
        seg = segs[0]
        if seg._x is goal.x and seg._y is goal.y
          newGoal()
        
        for seg, i in segs
          fraction = i/segments
                  
          s = sing(-fraction + t)
          scale seg, lerp fraction, 0, 1, s, s * 3/4
          
          speed = sping fraction + t
          
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
            
          move seg, seg._x, seg._y
