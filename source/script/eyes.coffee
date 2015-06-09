Take ["resize", "update", "svg"],
  (resize, update, svg)->
    return
    nEyePairs = 20
    
    t = 0
    xing = phasor  50, 250, 1/12
    ying = phasor   0, 10, 1/12
    ling = phasor   12, 18
    sing = phasor   15, 20, 3
    
    styleEye = (eye, phase, x)->
      move eye, x, ying phase
      grey eye, ling phase
      scale eye, sing phase
      eye
    
    makeEye = (phase, x)->
      eye = svg.create "circle", r: 1
      styleEye eye, phase, x
    
    eyes = for i in [0...nEyePairs]
      phase = i/nEyePairs
      left:  makeEye phase, -xing phase
      right: makeEye phase,  xing phase
    
    update (dt)->
      t += dt
      for eye, i in eyes
        phase = i/(nEyePairs+1)
        styleEye eye.left,  phase + t, -xing phase
        styleEye eye.right, phase + t,  xing phase
