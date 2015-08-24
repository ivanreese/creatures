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



Take(["update", "SVG", "math"], function(update, SVG, math) {
  var eyes, grey, i, ling, makeEye, move, nEyePairs, phase, phasor, scale, sing, styleEye, xing, ying;
  return;
  phasor = math.phasor;
  move = SVG.move;
  grey = SVG.grey;
  scale = SVG.scale;
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
    eye = SVG.create("circle", {
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
  var i, nWorms, worms;
  return;
  nWorms = 10;
  return worms = (function() {
    var j, ref, results;
    results = [];
    for (i = j = 0, ref = nWorms; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      results.push(Worm(i / (nWorms - 1)));
    }
    return results;
  })();
});

Take(["update", "SVG", "math"], function(update, SVG, math) {
  var grey, lerp, phasor;
  lerp = math.lerp;
  phasor = math.phasor;
  grey = SVG.grey;
  return Make("Worm", function(ageN) {
    var goal, greyPr, i, length, lengthN, localTime, newGoal, scalePr, seg, segs, speedPr;
    localTime = Math.random();
    goal = {
      x: 0,
      y: 0
    };
    lengthN = Math.random();
    length = lerp(10, 100, lengthN);
    greyPr = phasor(lerp(.06, .16, ageN), lerp(.16, .24, ageN), lerp(1.5, 0.5, ageN));
    scalePr = phasor(lerp(6, 10, ageN), lerp(7, 16, ageN), 2);
    speedPr = phasor(lerp(0, 0, ageN), lerp(0.5, 3, ageN * lengthN), 2);
    segs = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        seg = SVG.create("circle", {
          r: 1
        });
        seg._y = seg._x = 0;
        grey(seg, greyPr(i / length));
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
        SVG.scale(seg, lerp(scale, scale * 3 / 4, segN));
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

Take(["update", "SVG", "math", "stage"], function(update, SVG, math, stage) {
  var gauss, grey, lerp, makeLayer, makeVein, move, phasor, primeN, ramp, rnd, rotate, rotateN, scale;
  return;
  lerp = math.lerp;
  phasor = math.phasor;
  gauss = math.gauss;
  ramp = math.ramp;
  primeN = math.primeN;
  rotateN = math.rotateN;
  move = SVG.move;
  rotate = SVG.rotate;
  scale = SVG.scale;
  grey = SVG.grey;
  rnd = function(c, s) {
    if (c == null) {
      c = 0.5;
    }
    if (s == null) {
      s = 1;
    }
    return lerp(c - s / 2, c + s / 2, Math.random());
  };
  Take("Iris", function(Iris) {
    return Iris();
  });
  makeVein = function(phase, startY, endY, nPoints, wobbling, wiggling) {
    var baseX, j, p, pN, pNmid, parts, ref, wiggle, wobble, x, xWobble, xmid, y, ymid;
    x = 0;
    y = startY;
    parts = ["M" + x + "," + y];
    wiggle = wiggling * gauss(0.1, 10, phase);
    for (p = j = 1, ref = nPoints; 1 <= ref ? j < ref : j > ref; p = 1 <= ref ? ++j : --j) {
      pN = p / (nPoints - 1);
      pNmid = (p - 0.5) / (nPoints - 1);
      xmid = phasor(-wobbling / 5, wobbling / 5, wiggle, pNmid);
      ymid = lerp(startY, endY, pNmid);
      wobble = phasor(0.5, 2, wiggle, pN);
      xWobble = phasor(-wobbling, wobbling, wobble, pN);
      baseX = rnd(Math.pow(pN, 4), wiggle);
      x = gauss(baseX, xWobble, pN);
      y = lerp(startY, endY, pN);
      parts.push("S" + xmid + "," + ymid + " " + x + "," + y);
    }
    return parts.join(" ");
  };
  makeLayer = function(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR) {
    var eY, i, iF, iN, j, nP, options, ref, results, sY, vein;
    results = [];
    for (i = j = 0, ref = nVeins; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      iN = i / (nVeins - 1);
      iF = i / nVeins;
      sY = rnd(startY, startY / 2);
      eY = rnd(endY, endY / 3);
      nP = rnd(nPoints, nPointsR) | 0;
      options = {
        d: makeVein(iN, sY, eY, nP, wobbling, wiggling),
        fill: "none",
        stroke: stroke,
        "stroke-width": rnd(width, widthR),
        "stroke-linecap": "round"
      };
      vein = SVG.create("path", options, parent);
      results.push(rotate(vein, rnd(iF, angleR)));
    }
    return results;
  };
  return Make("Iris", function(parent) {
    var angleR, endY, nPoints, nPointsR, nVeins, startY, stroke, width, widthR, wiggling, wobbling;
    SVG.createRadialGradient("glowFG", true, "hsla(46,96%,73%,0.1)", "hsla(240,100%,70%,0.2)", "hsla(240,100%,70%,0)");
    SVG.createRadialGradient("glowBG", true, "hsla(46,96%,73%,0.8)", "hsla(240,100%,70%,0)");
    SVG.createGradient("singe", true, "#F42614", "#FEE070", "#EAB46F", "#775A45", "#3D2A0F");
    nVeins = 100;
    startY = 50;
    endY = 150;
    nPoints = 10;
    nPointsR = 4;
    wobbling = 2;
    wiggling = .5;
    width = 2;
    widthR = 1.4;
    stroke = "url(#singe)";
    angleR = 0.1;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    SVG.create("circle", {
      r: 400,
      fill: "url(#glowFG)"
    });
    nVeins = 60;
    startY = 30;
    endY = 50;
    nPoints = 5;
    nPointsR = 3;
    wobbling = 0.8;
    wiggling = 0;
    width = 3;
    widthR = 2;
    stroke = "#020603";
    angleR = 0.03;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 100;
    startY = 40;
    endY = 200;
    nPoints = 10;
    nPointsR = 4;
    wobbling = 5;
    wiggling = 1;
    width = 1.5;
    widthR = 1.4;
    stroke = "#E15B2C";
    angleR = 0.1;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 100;
    startY = 40;
    endY = 200;
    nPoints = 10;
    nPointsR = 4;
    wobbling = 5;
    wiggling = 1;
    width = 1.5;
    widthR = 1.4;
    stroke = "#AD3D20";
    angleR = 0.1;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 100;
    startY = 60;
    endY = 100;
    nPoints = 10;
    nPointsR = 4;
    wobbling = 1;
    wiggling = .2;
    width = 4;
    widthR = 2;
    stroke = "#FEE5BD";
    angleR = 0.1;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 100;
    startY = 50;
    endY = 150;
    nPoints = 10;
    nPointsR = 4;
    wobbling = 5;
    wiggling = 2;
    width = 5;
    widthR = 2;
    stroke = "#AE2522";
    angleR = 0.1;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 20;
    startY = 15;
    endY = 40;
    nPoints = 5;
    nPointsR = 3;
    wobbling = 5;
    wiggling = 4;
    width = 2;
    widthR = 1;
    stroke = "#600403";
    angleR = 0.03;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    SVG.create("circle", {
      r: 50,
      fill: "#500202"
    });
    SVG.create("circle", {
      r: 120,
      fill: "#FF0000"
    });
    SVG.create("circle", {
      r: 300,
      fill: "url(#glowBG)"
    });
    nVeins = 100;
    startY = 200;
    endY = 300;
    nPoints = 20;
    nPointsR = 3;
    wobbling = 3;
    wiggling = 0.2;
    width = 10;
    widthR = 2;
    stroke = "#020603";
    angleR = 0.03;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 250;
    startY = 200;
    endY = 300;
    nPoints = 20;
    nPointsR = 3;
    wobbling = 3;
    wiggling = 0.2;
    width = 5;
    widthR = 2;
    stroke = "#020603";
    angleR = 0.03;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 250;
    startY = 200;
    endY = 350;
    nPoints = 20;
    nPointsR = 3;
    wobbling = 3;
    wiggling = 0.2;
    width = 2;
    widthR = 1.9;
    stroke = "#020603";
    angleR = 0.03;
    makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
    nVeins = 250;
    startY = 250;
    endY = 350;
    nPoints = 20;
    nPointsR = 3;
    wobbling = 3;
    wiggling = 0.2;
    width = 0.5;
    widthR = 0;
    stroke = "#020603";
    angleR = 0.03;
    return makeLayer(parent, nVeins, startY, endY, nPoints, nPointsR, wobbling, wiggling, width, widthR, stroke, angleR);
  });
});

Take(["update", "SVG", "math", "stage", "Tentacle"], function(update, SVG, math, stage, Tentacle) {
  var d, gauss, grey, group, lerp, makeBody, move, phasor, primeN, ramp, rnd, rotate, rotateN, scale;
  return;
  lerp = math.lerp;
  phasor = math.phasor;
  gauss = math.gauss;
  ramp = math.ramp;
  primeN = math.primeN;
  rotateN = math.rotateN;
  move = SVG.move;
  rotate = SVG.rotate;
  scale = SVG.scale;
  grey = SVG.grey;
  group = function(parent) {
    return SVG.create("g", null, parent);
  };
  rnd = function(c, s) {
    if (c == null) {
      c = 0.5;
    }
    if (s == null) {
      s = 1;
    }
    return lerp(c - s / 2, c + s / 2, Math.random());
  };
  d = "M-41,-1 C-43,-51 43,-52 41,2 L38,60 C21,101 -20,101 -36,61 Z";
  Take("Octo", function(Octo) {
    var o;
    return o = Octo(0.5).root;
  });
  makeBody = function(parent, size, lightness) {
    var angle, body, i, j, parts, points, ref, x, y;
    parts = [];
    points = lerp(5, 21, size);
    for (i = j = 0, ref = points; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      angle = i / points * math.TAU;
      x = Math.round((Math.sin(angle)) * gauss(50, 200, i / points));
      y = Math.round((Math.cos(angle)) * gauss(50, 200, i / points));
      if (i === 0) {
        parts.push("M" + x + "," + y);
      } else {
        parts.push("T" + x + "," + y);
      }
    }
    parts.push("Z");
    body = SVG.create("path", {
      d: parts.join(" ")
    }, parent);
    grey(body, lightness);
    return body;
  };
  return Make("Octo", function(size) {
    var angle, angleSpread, body, i, iN, j, nTentacles, octo, ref, root, spread, t, x, y;
    root = group();
    scale(root, lerp(0.02, 1, size));
    body = makeBody(root, size, 0.22);
    nTentacles = Math.round(lerp(3, 8, Math.pow(size, 2)));
    for (i = j = 0, ref = nTentacles; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      iN = i / (nTentacles - 1) || 0;
      t = Tentacle(root, size).root;
      spread = lerp(rnd(1.7), 1, size);
      angle = lerp(-spread, spread, iN);
      x = Math.sin(angle) * 120;
      y = Math.cos(angle) * 40;
      move(t, x, y);
      angleSpread = lerp(rnd(spread / 10, 0.2), spread / 5, Math.pow(size, 1 / 2));
      rotate(t, phasor(angleSpread, -angleSpread, 0.25, iN - 0.5));
      scale(t, lerp(rnd(1, 0.2), 0.5, size));
    }
    update(function(t, dt) {
      var wiggleAngle, wiggleMax;
      x = gauss(-100, 100, t / 17);
      y = gauss(-100, -200, t / 27);
      move(root, x, y);
      wiggleMax = lerp(0, 0.02, 1, t / 37);
      wiggleAngle = gauss(-wiggleMax, wiggleMax, t / 19);
      return rotate(root, wiggleAngle);
    });
    return octo = {
      root: root
    };
  });
});

Take(["update", "SVG", "math"], function(update, SVG, math) {
  var input;
  input = 0;
  Take("Circle", function(Circle) {
    var angle, dist, i, j, results;
    results = [];
    for (i = j = 0; j < 100; i = ++j) {
      angle = i / 100;
      dist = math.lerp(0, 3, i);
      results.push(Circle(angle, dist));
    }
    return results;
  });
  Make("Circle", function(angle, dist) {
    var circle, h;
    h = 0;
    circle = SVG.create("circle", {
      r: 1
    });
    return update(function(t, dt) {
      var d, dir, maxVel, velocity;
      dir = input === 0 ? 1 : input / Math.abs(input);
      maxVel = math.lerp(0, Math.pow(input, 7) * 100 + input / 100, angle);
      velocity = maxVel;
      h += velocity;
      d = dist * math.gauss(-1, 1, h);
      SVG.hsl(circle, h, 1, .5);
      SVG.scale(circle, math.gauss(1, 100, h / 10));
      return SVG.move(circle, Math.sin(h + angle * math.TAU) * d, Math.cos(h + angle * math.TAU) * d);
    });
  });
  document.body.addEventListener("mousemove", function(e) {
    return input = (e.clientY / window.innerHeight) - 0.5;
  });
  document.body.addEventListener("touchmove", function(e) {
    return input = (e.touches.item(0).clientY / window.innerHeight) - 0.5;
  });
  return document.body.addEventListener("touchstart", function(e) {
    return e.preventDefault();
  });
});

Take("Swarm", function(Swarm) {
  var i, j, nSwarms, ref, results;
  nSwarms = 0;
  results = [];
  for (i = j = 0, ref = nSwarms; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    results.push(Swarm(Math.pow(i / (nSwarms - 1), 8)));
  }
  return results;
});

Take(["update", "SVG", "math", "stage"], function(update, SVG, math, stage) {
  var epsilon, gauss, lerp, move, phasor, primeN, ramp, randomPoint, rotate, rotateN;
  lerp = math.lerp;
  phasor = math.phasor;
  gauss = math.gauss;
  ramp = math.ramp;
  primeN = math.primeN;
  rotateN = math.rotateN;
  move = SVG.move;
  rotate = SVG.rotate;
  epsilon = 5;
  randomPoint = function() {
    return {
      x: lerp(-stage.hWidth + 100, stage.hWidth - 100, Math.random()),
      y: lerp(-stage.hHeight + 100, stage.hHeight - 100, Math.random())
    };
  };
  return Make("Swarm", function(ageN) {
    var angle, body, energy, energyGoal, energyMax, energyMin, goal, i, iF, nPieces, nPoints, p, piece, pieceI, pieces, points, rhythmP, rhythmPr, rhythmStagger, rotationP, sizeX, sizeY, spreadAge, spreadMax, spreadMin, time, updateEnergy, x, xRhythm, y, yRhythm;
    body = SVG.create("g");
    p = randomPoint();
    body._x = p.x;
    body._y = p.y;
    body._vx = body._vy = 0;
    body._ax = body._ay = 0;
    goal = randomPoint();
    time = Math.random() * 1000;
    energyGoal = energyMin = 1 / 10000;
    energy = energyMax = lerp(1, 1 / 300, ageN);
    updateEnergy = function(t) {
      var dEnergy, energyRate;
      energyRate = phasor(1 / 10000, energy / 10, 1 / 100000, t);
      if (energy === energyGoal) {
        return energyGoal = lerp(energyMin, energyMax, Math.random());
      } else {
        dEnergy = energyGoal - energy;
        if (dEnergy > energyRate) {
          dEnergy = energyRate;
        }
        if (dEnergy < -energyRate) {
          dEnergy = -energyRate;
        }
        return energy += dEnergy;
      }
    };
    rhythmP = Math.random();
    rhythmStagger = lerp(Math.random(), 0.25, 0.5);
    xRhythm = lerp(3, 8, primeN(rhythmP));
    yRhythm = lerp(4, 9, primeN(rotateN(rhythmP, rhythmStagger)));
    rhythmPr = phasor(0.5, 2, 1);
    rotationP = Math.random();
    spreadMin = 5;
    spreadMax = 50;
    spreadAge = lerp(spreadMin, spreadMax, ageN);
    nPieces = lerp(3, 500, Math.pow(ageN, 3));
    pieces = (function() {
      var j, ref, results;
      results = [];
      for (pieceI = j = 0, ref = nPieces; 0 <= ref ? j < ref : j > ref; pieceI = 0 <= ref ? ++j : --j) {
        nPoints = Math.round(lerp(3, 6, Math.random()));
        points = (function() {
          var k, ref1, results1;
          results1 = [];
          for (i = k = 0, ref1 = nPoints; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
            iF = i / nPoints;
            angle = iF * math.TAU;
            sizeX = lerp(Math.random(), 0.5, 8);
            sizeY = lerp(Math.random(), 0.5, 8);
            x = Math.cos(angle + Math.random() - 0.5) * sizeX;
            y = Math.sin(angle + Math.random() - 0.5) * sizeY;
            results1.push(x + "," + y);
          }
          return results1;
        })();
        piece = SVG.create("polygon", {
          points: points.join(" ")
        }, body);
        piece._seed = Math.random();
        SVG.grey(piece, gauss(ageN, Math.random() / 2 + .25, ageN));
        results.push(piece);
      }
      return results;
    })();
    return update(function(t, dt) {
      var dx, dy, j, len, pieceN, pieceSpread, results, scattering, xP, yP;
      time += dt * energy;
      updateEnergy(time);
      if (Math.abs(body._x - goal.x) < epsilon && Math.abs(body._y - goal.y) < epsilon) {
        goal = randomPoint();
      }
      dx = goal.x - body._x;
      dy = goal.y - body._y;
      angle = Math.atan2(dy, dx);
      body._ax = Math.cos(angle) * Math.min(energy / 50, Math.abs(dx));
      body._ay = Math.sin(angle) * Math.min(energy / 50, Math.abs(dy));
      body._vx += body._ax;
      body._vy += body._ay;
      body._vx *= 0.999;
      body._vy *= 0.999;
      body._x += body._vx;
      body._y += body._vy;
      SVG.move(body, body._x, body._y);
      energy += lerp((Math.abs(dx) + Math.abs(dy)) * 1 / 50000, 0, Math.pow(ageN, 2));
      results = [];
      for (pieceI = j = 0, len = pieces.length; j < len; pieceI = ++j) {
        piece = pieces[pieceI];
        pieceN = pieceI / (nPieces - 1);
        pieceSpread = gauss(spreadMin, spreadAge, pieceN);
        scattering = (1 - ageN) * piece._seed;
        xP = pieceN * xRhythm - time + scattering;
        yP = pieceN * yRhythm + time + scattering;
        x = gauss(-pieceSpread, pieceSpread, xP);
        y = gauss(-pieceSpread, pieceSpread, yP);
        move(piece, x, y);
        results.push(rotate(piece, rotationP + time));
      }
      return results;
    });
  });
});

Take(["update", "SVG", "math", "stage"], function(update, SVG, math, stage) {
  var d, gauss, grey, lerp, makeCircle, makeContainer, makeSeg, mouse, move, phasor, primeN, ramp, rnd, rotate, rotateN, scale;
  lerp = math.lerp;
  phasor = math.phasor;
  gauss = math.gauss;
  ramp = math.ramp;
  primeN = math.primeN;
  rotateN = math.rotateN;
  move = SVG.move;
  rotate = SVG.rotate;
  scale = SVG.scale;
  grey = SVG.grey;
  rnd = function(c, s) {
    if (c == null) {
      c = 0.5;
    }
    if (s == null) {
      s = 1;
    }
    return lerp(c - s / 2, c + s / 2, Math.random());
  };
  d = "M-41,-1 C-43,-51 43,-52 41,2 L38,60 C21,101 -20,101 -36,61 Z";
  makeContainer = function(parent) {
    var container;
    container = SVG.create("g", null, parent);
    container._phase = Math.random() * 1000;
    return container;
  };
  makeCircle = function(parent, rc, rs, xc, xs, yc, ys, g) {
    var left, right;
    left = SVG.create("circle", {
      r: rnd(rc, rs)
    }, parent);
    right = SVG.create("circle", {
      r: rnd(rc, rs)
    }, parent);
    move(left, rnd(-xc, xs), rnd(yc, ys));
    move(right, rnd(+xc, xs), rnd(yc, ys));
    grey(left, g);
    grey(right, g);
    scale(left, rnd(1, 0.1), rnd(1, 0.1));
    return scale(right, rnd(1, 0.1), rnd(1, 0.1));
  };
  makeSeg = function(parent, g) {
    return grey(SVG.create("path", {
      d: d
    }, parent), g);
  };
  mouse = {
    x: 0,
    y: 0
  };
  document.addEventListener("mousemove", function(e) {
    mouse.x = e.clientX - stage.hWidth;
    return mouse.y = e.clientY - stage.hHeight;
  });
  return Make("Tentacle", function(owner, size) {
    var container, containers, i, iM, iN, j, length, lightness, maxLength, parent, ref, root, suckerSegs, tentacle;
    maxLength = 50;
    length = lerp(30, maxLength, Math.random());
    containers = [];
    parent = root = makeContainer(owner);
    scale(root, size);
    makeCircle(parent, 25, 3, 27, 2, 0, 2, 0.23);
    makeCircle(parent, 24, 2, 25, 2, 60, 2, 0.22);
    makeSeg(parent, 0.2);
    suckerSegs = Math.sqrt(size) * 50 - 10;
    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      iN = i / (length - 1);
      iM = i / (maxLength - 1);
      parent = container = makeContainer(parent);
      containers.push(container);
      move(container, rnd(), rnd(60));
      scale(container, rnd(0.92, 0.02), rnd(0.95, 0.02));
      lightness = lerp(0.2, 0, iM + (phasor(0.05, -0.05, 8, iM)));
      lightness += Math.pow(iM, 4);
      if (i < suckerSegs) {
        makeCircle(parent, 22, 2, 24, 2, 60, 2, lightness + 0.02);
      }
      makeSeg(parent, lightness);
    }
    update(function(t, dt) {
      var curlAngle, k, len, results, straightTip, wiggleAngle, wiggleMax;
      results = [];
      for (i = k = 0, len = containers.length; k < len; i = ++k) {
        container = containers[i];
        iN = i / (length - 1);
        wiggleMax = phasor(0, 0.05, 1 - iN, t / 51 + container._phase);
        wiggleAngle = gauss(-wiggleMax, wiggleMax, t / 13 + container._phase);
        curlAngle = (gauss(-0.1, 0.1, t / 11 + container._phase)) * Math.sqrt(iN);
        straightTip = lerp(1, 0, iN);
        results.push(rotate(container, (curlAngle + wiggleAngle) * straightTip));
      }
      return results;
    });
    return tentacle = {
      root: root
    };
  });
});

Take("Curry", function(Curry) {
  var math, primes;
  primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
  return Make("math", math = {
    TAU: Math.PI * 2,
    lerp: function(min, max, i) {
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

var slice = [].slice;

Take("stage", function(stage) {
  var SVG, container, defs, root, svgNS;
  svgNS = "http://www.w3.org/2000/svg";
  root = document.querySelector("svg");
  defs = root.querySelector("defs");
  container = document.createElementNS(svgNS, "g");
  root.appendChild(container);
  Make("SVG", SVG = {
    create: function(type, init, parent, append) {
      var elm, k, v;
      if (parent == null) {
        parent = container;
      }
      if (append == null) {
        append = false;
      }
      elm = document.createElementNS(svgNS, type);
      if (append) {
        parent.appendChild(elm);
      } else {
        SVG.prependChild(parent, elm);
      }
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
      SVG.attr(elm, "fill", "hsl(0, 0%, " + (l * 100) + "%)");
      return elm;
    },
    hsl: function(elm, h, s, l) {
      SVG.attr(elm, "fill", "hsl(" + (h * 360) + ", " + (s * 100) + "%, " + (l * 100) + "%)");
      return elm;
    },
    createGradient: function() {
      var grad, i, iN, j, len, name, options, stop, stops, vertical;
      name = arguments[0], vertical = arguments[1], stops = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      options = vertical ? {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 1,
        id: name
      } : {
        id: name
      };
      grad = SVG.create("linearGradient", options, defs);
      for (i = j = 0, len = stops.length; j < len; i = ++j) {
        stop = stops[i];
        iN = i / (stops.length - 1);
        SVG.create("stop", {
          offset: iN * 100 + "%",
          "stop-color": stop
        }, grad, true);
      }
      return null;
    },
    createRadialGradient: function() {
      var grad, i, iN, j, len, name, options, stop, stops;
      name = arguments[0], stops = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      options = {
        id: name
      };
      grad = SVG.create("radialGradient", options, defs);
      for (i = j = 0, len = stops.length; j < len; i = ++j) {
        stop = stops[i];
        iN = i / (stops.length - 1);
        SVG.create("stop", {
          offset: iN * 100 + "%",
          "stop-color": stop
        }, grad, true);
      }
      return null;
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
