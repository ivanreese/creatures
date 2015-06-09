do ()->
  callbacks = []
  w = 0
  h = 0
  
  resize = ()->
    w = window.innerWidth
    h = window.innerHeight
    for cb in callbacks
      cb w, h
  
  window.addEventListener "resize", resize
  resize()
  
  Make "resize", (cb)->
    callbacks.push cb
    cb w, h
