Take ["update", "SVG", "math"],
  (update, SVG, math)->
    input = 0
    
    Take "Circle", (Circle)->
      for i in [0...100]
        angle = i/100
        dist = math.lerp 0, 3, i
        Circle(angle, dist)
    
    Make "Circle", (angle, dist)->
      h = 0
      circle = SVG.create "circle", r: 1
      
      update (t, dt)->
        maxVel = math.lerp 0, Math.pow(input, 7) * 100 + input/100, angle
        velocity = maxVel # math.gauss 0, maxVel, t
        
        h += velocity
        d = dist * math.gauss -1, 1, h
        
        SVG.hsl circle, h, 1, .5
        SVG.scale circle, math.gauss 1, 100, h/10
        SVG.move circle, Math.sin(h+angle*math.TAU)*d, Math.cos(h+angle*math.TAU)*d
    
    document.body.addEventListener "mousemove", (e)->
      input = (e.clientY / window.innerHeight) - 0.5

    document.body.addEventListener "touchmove", (e)->
      input = (e.touches.item(0).clientY / window.innerHeight) - 0.5
    
    document.body.addEventListener "touchstart", (e)->
      e.preventDefault()
