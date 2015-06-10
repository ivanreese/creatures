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

var slice = [].slice;

(function() {
  return Make("Curry", function(nArguments, functionToCurry) {
    var curriedFn;
    if (functionToCurry == null) {
      functionToCurry = nArguments;
      nArguments = functionToCurry.length;
    }
    return curriedFn = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (args.length < nArguments) {
        return function() {
          var moreArgs;
          moreArgs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return curriedFn.apply(null, slice.call(args).concat(slice.call(moreArgs)));
        };
      } else {
        return functionToCurry.apply(null, args);
      }
    };
  });
})();



Take(["update", "svg"], function(update, svg) {
  var eyes, i, ling, makeEye, nEyePairs, phase, sing, styleEye, xing, ying;
  return;
  nEyePairs = 20;
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
  return update(function(time) {
    var eye, j, len, results;
    results = [];
    for (i = j = 0, len = eyes.length; j < len; i = ++j) {
      eye = eyes[i];
      phase = i / (nEyePairs + 1);
      styleEye(eye.left, phase + time, -xing(phase));
      results.push(styleEye(eye.right, phase + time, xing(phase)));
    }
    return results;
  });
});

Take(["Worm", "math"], function(Worm, math) {
  var age, oldest, worms, youngest;
  return;
  oldest = 8;
  youngest = 1;
  return worms = (function() {
    var j, ref, ref1, results;
    results = [];
    for (age = j = ref = oldest, ref1 = youngest; ref <= ref1 ? j <= ref1 : j >= ref1; age = ref <= ref1 ? ++j : --j) {
      results.push(Worm(math.lerp(age, youngest, oldest)));
    }
    return results;
  })();
});

Take(["update", "SVG", "math"], function(update, SVG, math) {
  var lerpN, phasor;
  lerpN = math.lerpN;
  phasor = math.phasor;
  return Make("Worm", function(ageN) {
    var goal, greyPr, i, length, lengthN, localTime, newGoal, scalePr, seg, segs, speedPr;
    localTime = Math.random();
    goal = {
      x: 0,
      y: 0
    };
    lengthN = Math.random();
    length = lerpN(lengthN, 10, 100);
    greyPr = phasor(lerpN(ageN, .06, .16), lerpN(ageN, .16, .24), lerpN(ageN, 1.5, 0.5));
    scalePr = phasor(lerpN(ageN, 6, 10), lerpN(ageN, 7, 16), 2);
    speedPr = phasor(lerpN(ageN, 0, 0), lerpN(ageN * lengthN, 0.5, 3), 2);
    segs = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        seg = SVG.create("circle", {
          r: 1
        });
        seg._y = seg._x = 0;
        SVG.grey(seg, greyPr(i / length));
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
    return update(function(t, dt) {
      var angle, dx, dy, j, last, len, results, scale, segN, speed;
      localTime += dt;
      seg = segs[0];
      if (seg._x === goal.x && seg._y === goal.y) {
        newGoal();
      }
      results = [];
      for (i = j = 0, len = segs.length; j < len; i = ++j) {
        seg = segs[i];
        segN = i / (length - 1);
        scale = scalePr(localTime - segN);
        SVG.scale(seg, lerpN(segN, scale, scale * 3 / 4));
        speed = speedPr(-segN + localTime);
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
        results.push(SVG.move(seg, seg._x, seg._y));
      }
      return results;
    });
  });
});

Take("Swarm", function(Swarm) {
  var i, j, nSwarms, ref, results;
  nSwarms = 5;
  results = [];
  for (i = j = 0, ref = nSwarms; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    results.push(Swarm(i / (nSwarms - 1)));
  }
  return results;
});

Take(["update", "SVG", "math", "stage"], function(update, SVG, math, stage) {
  var gauss, lerpN, lerpNEW, move, phasor, primeN, ramp, rotate, rotateN;
  lerpN = math.lerpN;
  lerpNEW = math.lerpNEW;
  phasor = math.phasor;
  gauss = math.gauss;
  ramp = math.ramp;
  primeN = math.primeN;
  rotateN = math.rotateN;
  move = SVG.move;
  rotate = SVG.rotate;
  return Make("Swarm", function(ageN) {
    var angle, body, chaos, energy, i, iF, nPieces, nPoints, piece, pieceI, pieces, points, rhythmP, rotationP, spreadAge, spreadMax, spreadMin, time, x, xRhythm, y, yRhythm;
    body = SVG.create("g");
    time = 0;
    energy = lerpN(ageN, 1, 1 / 300);
    rhythmP = Math.random();
    xRhythm = lerpNEW(4, 8, primeN(rhythmP));
    yRhythm = lerpNEW(4, 8, primeN(rotateN(rhythmP, Math.random() / 4 + 0.25)));
    chaos = ramp(1, 0, ageN);
    rotationP = Math.random();
    spreadMin = 5;
    spreadMax = 50;
    spreadAge = lerpNEW(spreadMin, spreadMax, ageN);
    nPieces = lerpNEW(3, 200, ageN);
    pieces = (function() {
      var j, ref, results;
      results = [];
      for (pieceI = j = 0, ref = nPieces; 0 <= ref ? j < ref : j > ref; pieceI = 0 <= ref ? ++j : --j) {
        nPoints = Math.round(lerpN(Math.random(), 3, 6));
        points = (function() {
          var k, ref1, results1;
          results1 = [];
          for (i = k = 0, ref1 = nPoints; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
            iF = i / nPoints;
            angle = iF * math.TAU;
            x = Math.cos(angle + Math.random() - 0.5) * (nPoints / 3 + Math.random());
            y = Math.sin(angle + Math.random() - 0.5) * (nPoints / 3 + Math.random());
            results1.push(x + "," + y);
          }
          return results1;
        })();
        piece = SVG.create("polygon", {
          points: points.join(" ")
        }, body);
        SVG.grey(piece, ageN);
        piece._r = Math.random();
        results.push(piece);
      }
      return results;
    })();
    update(function(t, dt) {
      var j, len, pieceN, pieceSpread, results, xP, yP;
      time += dt * energy;
      results = [];
      for (pieceI = j = 0, len = pieces.length; j < len; pieceI = ++j) {
        piece = pieces[pieceI];
        pieceN = pieceI / (nPieces - 1);
        pieceSpread = gauss(spreadMin, spreadAge, pieceN);
        xP = pieceN * xRhythm - time + piece._r * chaos;
        yP = pieceN * yRhythm + time + piece._r * chaos;
        x = gauss(-pieceSpread, pieceSpread, xP);
        y = gauss(-pieceSpread, pieceSpread, yP);
        move(piece, x, y);
        results.push(rotate(piece, rotationP + time));
      }
      return results;
    });
    return stage.onResize(function(w, h, hW, hH) {
      y = lerpN(ageN, 50 - hH, hH - 100);
      return move(body, 0, y);
    });
  });
});

Take("Curry", function(Curry) {
  var math, primes;
  primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
  return Make("math", math = {
    TAU: Math.PI * 2,
    lerp: function(i, inmin, inmax, outmin, outmax) {
      if (outmin == null) {
        outmin = 0;
      }
      if (outmax == null) {
        outmax = 1;
      }
      i -= inmin;
      i /= inmax - inmin;
      i *= outmax - outmin;
      i += outmin;
      return i;
    },
    lerpN: function(i, min, max) {
      return i * (max - min) + min;
    },
    lerpNEW: function(min, max, i) {
      return i * (max - min) + min;
    },
    lerps: function(i, min, max) {
      return (i / 2 + 0.5) * (max - min) + min;
    },
    phasor: Curry(function(min, max, cycles, phase) {
      if (cycles == null) {
        cycles = 1;
      }
      return math.lerps(Math.sin(phase * cycles * math.TAU), min, max);
    }),
    ramp: Curry(function(min, max, phase) {
      return math.lerps(Math.cos(phase * Math.PI), max, min);
    }),
    gauss: Curry(function(min, max, phase) {
      return math.ramp(min, max, phase * 2);
    }),
    prime: function(i) {
      return primes[Math.floor(Math.max(0, Math.min(1, i)) * primes.length)];
    },
    primeN: function(i) {
      return math.prime(i) / 1000;
    },
    rotateN: function(i, angle) {
      return (i + angle) % 1;
    }
  });
});

(function() {
  var callbacks, doResize, run, stage;
  callbacks = [];
  run = function(callback) {
    return callback(stage.width, stage.height, stage.hWidth, stage.hHeight);
  };
  doResize = function() {
    var callback, i, len, results;
    stage.width = window.innerWidth;
    stage.height = window.innerHeight;
    stage.hWidth = stage.width / 2;
    stage.hHeight = stage.height / 2;
    results = [];
    for (i = 0, len = callbacks.length; i < len; i++) {
      callback = callbacks[i];
      results.push(run(callback));
    }
    return results;
  };
  Make("stage", stage = {
    width: 0,
    height: 0,
    hWidth: 0,
    hHeight: 0,
    onResize: function(callback) {
      callbacks.push(callback);
      return run(callback);
    }
  });
  window.addEventListener("resize", doResize);
  return doResize();
})();

Take("stage", function(stage) {
  var SVG, container, root, svgNS;
  svgNS = "http://www.w3.org/2000/svg";
  root = document.querySelector("svg");
  container = document.createElementNS(svgNS, "g");
  root.appendChild(container);
  Make("SVG", SVG = {
    create: function(type, init, parent) {
      var elm, k, v;
      if (parent == null) {
        parent = container;
      }
      elm = document.createElementNS(svgNS, type);
      SVG.prependChild(parent, elm);
      for (k in init) {
        v = init[k];
        SVG.attr(elm, k, v);
      }
      return elm;
    },
    prependChild: function(parent, child) {
      if (parent.hasChildNodes()) {
        return parent.insertBefore(child, parent.firstChild);
      } else {
        return parent.appendChild(child);
      }
    },
    attr: function(elm, k, v) {
      if (v != null) {
        elm.setAttribute(k, v);
        return v;
      } else {
        return elm.getAttribute(k);
      }
    },
    move: function(elm, x, y) {
      if (y == null) {
        y = 0;
      }
      if (elm._trs == null) {
        elm._trs = [];
      }
      elm._trs[0] = "translate(" + x + ", " + y + ")";
      SVG.attr(elm, "transform", elm._trs.join(" "));
      return elm;
    },
    rotate: function(elm, r) {
      if (elm._trs == null) {
        elm._trs = [];
      }
      elm._trs[1] = "rotate(" + (r * 360) + ")";
      SVG.attr(elm, "transform", elm._trs.join(" "));
      return elm;
    },
    scale: function(elm, x, y) {
      if (y == null) {
        y = x;
      }
      if (elm._trs == null) {
        elm._trs = [];
      }
      elm._trs[2] = "scale(" + x + ", " + y + ")";
      SVG.attr(elm, "transform", elm._trs.join(" "));
      return elm;
    },
    grey: function(elm, l) {
      return SVG.attr(elm, "fill", "hsl(0, 0%, " + (l * 100) + "%)");
    }
  });
  return stage.onResize(function(w, h, hW, hH) {
    return SVG.attr(container, "transform", "translate(" + hW + ", " + hH + ")");
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
      cb(time / 1000, (time - lastTime) / 1000);
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
