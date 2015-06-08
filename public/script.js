var circle, svg, svgns, update, warmup;

svgns = "http://www.w3.org/2000/svg";

svg = document.querySelector("svg");

circle = document.createElementNS(svgns, "circle");

circle.setAttribute("cx", 200);

circle.setAttribute("cy", 200);

circle.setAttribute("r", 100);

svg.appendChild(circle);

update = function(dt) {};

warmup = function(dt) {};

requestAnimationFrame(warmup);
