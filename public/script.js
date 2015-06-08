var circle, svg, svgns;

svgns = "http://www.w3.org/2000/svg";

svg = document.querySelector("svg");

circle = document.createElementNS(svgns, "circle");

circle.setAttribute("cx", "100");

circle.setAttribute("cy", "100");

circle.setAttribute("r", "100");

svg.appendChild(circle);
