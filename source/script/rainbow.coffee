Take ["update", "SVG", "math", "stage", "Tentacle"],
  (update, SVG, math, stage, Tentacle)->

    group = (parent)-> SVG.create "g", null, parent
    rnd = (c=0.5,s=1)-> math.lerp c-s/2, c+s/2, Math.random()
    
    Take "Circle", (Circle)->
      for i in [0...100]
        angle = i/100
        dist = math.lerp 0, 3, i
        Circle(angle, dist)
    
    input = 0
    
    document.body.addEventListener "mousemove", (e)->
      input = (e.clientY / window.innerHeight) - 0.5

    document.body.addEventListener "touchstart", (e)->
      e.preventDefault()

    document.body.addEventListener "touchmove", (e)->
      input = (e.touches.item(0).clientY / window.innerHeight) - 0.5
    
    Make "Circle", (angle, dist)->
      circle = SVG.create "circle", r: 1
      
      h = 0
      
      update (t, dt)->
        dir = if input is 0 then 1 else input/Math.abs(input)
        maxVel = math.lerp 0, Math.pow(input, 7) * 100 + input/100, angle
        velocity = maxVel # math.gauss 0, maxVel, t
        
        h += velocity
        SVG.hsl circle, h, 1, .5
        
        d = dist * math.gauss -1, 1, h
        
        SVG.scale circle, math.gauss 1, 100, h/10
        SVG.move circle, Math.sin(h+angle*math.TAU)*d, Math.cos(h+angle*math.TAU)*d
