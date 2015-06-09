do ()->
  callbacks = []
  lastTime = 0
  
  tick = (time)->
    document.dispatchEvent
    for cb in callbacks
      cb((time - lastTime)/1000)
    lastTime = time
    requestAnimationFrame tick
  
  requestAnimationFrame (time)->
    lastTime = time
    requestAnimationFrame tick
  
  Make "update", (cb)->
    callbacks.push cb
