do ()->
  
  callbacks = []
  
  run = (callback)->
    callback stage.width, stage.height, stage.hWidth, stage.hHeight
  
  doResize = ()->
    stage.width = window.innerWidth
    stage.height = window.innerHeight
    stage.hWidth = stage.width/2
    stage.hHeight = stage.height/2
    run(callback) for callback in callbacks
  
  Make "stage", stage =
    width: 0
    height: 0
    hWidth: 0
    hHeight: 0
    onResize: (callback)->
      callbacks.push callback
      run(callback)
  
  window.addEventListener "resize", doResize
  doResize()
