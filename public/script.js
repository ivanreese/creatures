(function() {
  var EVENTS, allNeedsAreMet, alreadyChecking, angularModule, checkWaitingTakers, eventName, i, len, made, makeHandler, notify, register, resolve, results, waitingTakers;
  EVENTS = ["beforeunload", "click", "load", "unload"];
  made = {};
  waitingTakers = [];
  alreadyChecking = false;
  if (window.angular != null) {
    angularModule = angular.module("TakeAndMake", []);
  }
  window.Make = function(name, value) {
    if (value == null) {
      value = name;
    }
    if (name != null) {
      register(name, value);
    }
    return made;
  };
  window.Take = function(needs, callback) {
    if (needs != null) {
      resolve(needs, callback);
    }
    return waitingTakers;
  };
  window.DebugTakeMake = function() {
    var i, j, len, len1, need, ref, unresolved, waiting;
    unresolved = {};
    for (i = 0, len = waitingTakers.length; i < len; i++) {
      waiting = waitingTakers[i];
      ref = waiting.needs;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        need = ref[j];
        if (made[need] == null) {
          if (unresolved[need] == null) {
            unresolved[need] = 0;
          }
          unresolved[need]++;
        }
      }
    }
    return unresolved;
  };
  register = function(name, value) {
    if (made[name] != null) {
      throw new Error("You may not Make() the same name twice: " + name);
    }
    made[name] = value;
    if (angularModule != null) {
      angularModule.constant(name, value);
    }
    return checkWaitingTakers();
  };
  checkWaitingTakers = function() {
    var i, index, len, taker;
    if (alreadyChecking) {
      return;
    }
    alreadyChecking = true;
    for (index = i = 0, len = waitingTakers.length; i < len; index = ++i) {
      taker = waitingTakers[index];
      if (allNeedsAreMet(taker.needs)) {
        waitingTakers.splice(index, 1);
        notify(taker);
        alreadyChecking = false;
        return checkWaitingTakers();
      }
    }
    return alreadyChecking = false;
  };
  allNeedsAreMet = function(needs) {
    return needs.every(function(name) {
      return made[name] != null;
    });
  };
  notify = function(taker) {
    var name, resolvedNeeds;
    resolvedNeeds = (function() {
      var i, len, ref, results;
      ref = taker.needs;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        name = ref[i];
        results.push(made[name]);
      }
      return results;
    })();
    return taker.callback.apply(null, resolvedNeeds);
  };
  resolve = function(needs, callback) {
    var taker;
    if (typeof needs === "string") {
      needs = [needs];
    }
    taker = {
      needs: needs,
      callback: callback
    };
    if (allNeedsAreMet(needs)) {
      return setTimeout(function() {
        return notify(taker);
      });
    } else {
      return waitingTakers.push(taker);
    }
  };
  makeHandler = function(eventName) {
    var handler;
    return handler = function(eventObject) {
      window.removeEventListener(eventName, handler);
      Make(eventName, eventObject);
      return void 0;
    };
  };
  results = [];
  for (i = 0, len = EVENTS.length; i < len; i++) {
    eventName = EVENTS[i];
    results.push(window.addEventListener(eventName, makeHandler(eventName)));
  }
  return results;
})();



Take(["resize", "update", "svg"], function(resize, update, svg) {
  var eyes, i, ling, makeEye, nEyePairs, phase, sing, styleEye, t, xing, ying;
  return;
  nEyePairs = 20;
  t = 0;
  xing = phasor(50, 250, 1 / 12);
  ying = phasor(0, 10, 1 / 12);
  ling = phasor(12, 18);
  sing = phasor(15, 20, 3);
  styleEye = function(eye, phase, x) {
    move(eye, x, ying(phase));
    grey(eye, ling(phase));
    scale(eye, sing(phase));
    return eye;
  };
  makeEye = function(phase, x) {
    var eye;
    eye = svg.create("circle", {
      r: 1
    });
    return styleEye(eye, phase, x);
  };
  eyes = (function() {
    var j, ref, results;
    results = [];
    for (i = j = 0, ref = nEyePairs; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      phase = i / nEyePairs;
      results.push({
        left: makeEye(phase, -xing(phase)),
        right: makeEye(phase, xing(phase))
      });
    }
    return results;
  })();
  return update(function(dt) {
    var eye, j, len, results;
    t += dt;
    results = [];
    for (i = j = 0, len = eyes.length; j < len; i = ++j) {
      eye = eyes[i];
      phase = i / (nEyePairs + 1);
      styleEye(eye.left, phase + t, -xing(phase));
      results.push(styleEye(eye.right, phase + t, xing(phase)));
    }
    return results;
  });
});

Take("Worm", function(Worm) {
  var i, worms;
  return worms = (function() {
    var j, results;
    results = [];
    for (i = j = 1; j <= 8; i = ++j) {
      results.push(Worm(i * 10));
    }
    return results;
  })();
});

Take(["resize", "update", "svg"], function(resize, update, svg) {
  return Make("Worm", function(segments) {
    var goal, i, ling, newGoal, seg, segs, sing, sping, t;
    t = 0;
    goal = {
      x: 0,
      y: 0
    };
    ling = phasor(12, 18, 1);
    sing = phasor(14, 17, 2);
    sping = phasor(0, segments / 20, 2);
    segs = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 0, ref = segments; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        seg = svg.create("circle", {
          r: 1
        });
        seg._y = seg._x = 0;
        grey(seg, ling(i / segments));
        results.push(seg);
      }
      return results;
    })();
    newGoal = function() {
      return goal = {
        x: Math.random() * 500 - 250,
        y: Math.random() * 500 - 250
      };
    };
    return update(function(dt) {
      var angle, dx, dy, fraction, j, last, len, results, s, speed;
      t += dt;
      seg = segs[0];
      if (seg._x === goal.x && seg._y === goal.y) {
        newGoal();
      }
      results = [];
      for (i = j = 0, len = segs.length; j < len; i = ++j) {
        seg = segs[i];
        fraction = i / segments;
        s = sing(-fraction + t);
        scale(seg, lerp(fraction, 0, 1, s, s * 3 / 4));
        speed = sping(fraction + t);
        if (i === 0) {
          dx = goal.x - seg._x;
          dy = goal.y - seg._y;
          angle = Math.atan2(dy, dx);
          seg._x += Math.cos(angle) * Math.min(speed, Math.abs(dx));
          seg._y += Math.sin(angle) * Math.min(speed, Math.abs(dy));
        } else {
          last = segs[i - 1];
          dx = last._x - seg._x;
          dy = last._y - seg._y;
          angle = Math.atan2(dy, dx);
          if (Math.abs(dx) > speed) {
            seg._x += Math.cos(angle) * speed;
          }
          if (Math.abs(dy) > speed) {
            seg._y += Math.sin(angle) * speed;
          }
        }
        results.push(move(seg, seg._x, seg._y));
      }
      return results;
    });
  });
});

var TAU, attr, grey, lerp, move, phasor, scale;

TAU = Math.PI * 2;

phasor = function(min, max, cycles) {
  if (cycles == null) {
    cycles = 1;
  }
  return function(phase) {
    return (Math.sin(TAU * phase * cycles) / 2 + 0.5) * (max - min) + min;
  };
};

lerp = function(i, im, iM, om, oM) {
  i -= im;
  i /= iM - im;
  i *= oM - om;
  i += om;
  return i;
};

attr = function(elm, k, v) {
  if (v != null) {
    elm.setAttribute(k, v);
    return v;
  } else {
    return elm.getAttribute(k);
  }
};

move = function(elm, x, y) {
  if (y == null) {
    y = 0;
  }
  if (elm._trs == null) {
    elm._trs = [];
  }
  elm._trs[0] = "translate(" + x + ", " + y + ")";
  attr(elm, "transform", elm._trs.join(" "));
  return elm;
};

scale = function(elm, x, y) {
  if (y == null) {
    y = x;
  }
  if (elm._trs == null) {
    elm._trs = [];
  }
  elm._trs[2] = "scale(" + x + ", " + y + ")";
  attr(elm, "transform", elm._trs.join(" "));
  return elm;
};

grey = function(elm, l) {
  return attr(elm, "fill", "hsl(0, 0%, " + l + "%)");
};

(function() {
  var callbacks, h, resize, w;
  callbacks = [];
  w = 0;
  h = 0;
  resize = function() {
    var cb, i, len, results;
    w = window.innerWidth;
    h = window.innerHeight;
    results = [];
    for (i = 0, len = callbacks.length; i < len; i++) {
      cb = callbacks[i];
      results.push(cb(w, h));
    }
    return results;
  };
  window.addEventListener("resize", resize);
  resize();
  return Make("resize", function(cb) {
    callbacks.push(cb);
    return cb(w, h);
  });
})();

Take("resize", function(resize) {
  var root, svg, svgns;
  svgns = "http://www.w3.org/2000/svg";
  svg = document.querySelector("svg");
  root = document.createElementNS(svgns, "g");
  svg.appendChild(root);
  resize(function(w, h) {
    return attr(root, "transform", "translate(" + (w / 2) + ", " + (h / 2) + ")");
  });
  return Make("svg", {
    create: function(type, init, parent) {
      var elm, k, v;
      if (parent == null) {
        parent = root;
      }
      elm = document.createElementNS(svgns, type);
      parent.appendChild(elm);
      for (k in init) {
        v = init[k];
        attr(elm, k, v);
      }
      return elm;
    }
  });
});

(function() {
  var callbacks, lastTime, tick;
  callbacks = [];
  lastTime = 0;
  tick = function(time) {
    var cb, i, len;
    document.dispatchEvent;
    for (i = 0, len = callbacks.length; i < len; i++) {
      cb = callbacks[i];
      cb((time - lastTime) / 1000);
    }
    lastTime = time;
    return requestAnimationFrame(tick);
  };
  requestAnimationFrame(function(time) {
    lastTime = time;
    return requestAnimationFrame(tick);
  });
  return Make("update", function(cb) {
    return callbacks.push(cb);
  });
})();
