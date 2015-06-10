Take ["update", "svg"],
  (update, svg)->
    return
    nEyePairs = 20
    
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
    
    update (time)->
      for eye, i in eyes
        phase = i/(nEyePairs+1)
        styleEye eye.left,  phase + time, -xing phase
        styleEye eye.right, phase + time,  xing phase
