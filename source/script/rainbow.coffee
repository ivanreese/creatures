Take ["update", "SVG", "math"],
  (update, SVG, math)->
    input = 0 # ONE DIMENSIONAL INPUT FROM THE USER, BECAUSE THEY RATHER LACK DEPTH OF CHARACTER
    
    Take "Circle", (Circle)->
      for i in [0...100] # AND LET A HUNDRED CIRCLES BLOOM
        angle = i/100 * math.TAU
        dist = math.lerp 0, 3, i
        Circle(angle, dist)
    
    Make "Circle", (angle, dist)->
      pos = 0
      circle = SVG.create "circle", r: 1
      
      # I DON'T NORMALLY TYPE INANE COMMENTS IN ALL CAPS. PROMISE.i
      update (t, dt)->
        velocity = math.lerp 0, Math.pow(input, 7) * 100 + input/100, angle
        pos += velocity
        r = dist * math.gauss -1, 1, pos
        x = Math.sin(pos + angle) * r
        y = Math.cos(pos + angle) * r
        s = math.gauss 1, 100, pos/10
        
        SVG.scale circle, s
        SVG.move circle, x, y
        SVG.hsl circle, pos, 1, .5
        # IF YOU ARE READING THIS, YOU DON'T NEED GLASSES
        # BUT YOU MIGHT NEED SOMETHING BETTER TO DO
        # MAY I SUGGEST EATING A POPSICLE
    
    
    # RECEIVE INPUT FROM THE GREATER COMMUNITY
    setInput = (v)-> input = (v / window.innerHeight) - 0.5
    document.body.addEventListener "mousemove", (e)-> setInput(e.clientY)
    document.body.addEventListener "touchmove", (e)-> setInput(e.touches.item(0).clientY)
    document.body.addEventListener "touchstart", (e)-> e.preventDefault()
