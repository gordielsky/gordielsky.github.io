//Modes that don't work
//angleMode(DEGREES);
//rectMode(CENTER);

//Branch blueprint
class Branch {
  
  constructor(x, y, angle) {
    //Starting position
    this.startX = x;
    this.startY = y;
    //Current (dynamically updating position)
    this.x = x;
    this.y = y;
    //Other independent properties - colour, angle, etc
    this.angle = angle;
    this.colour = element.primaryColour;
    this.growing = true; //If the length should keep increasing
    this.growthSpeed = this.getGrowthSpeed(angle);
    this.maxLengthPercent = 20; //Percent of screen that the branch can cover
    var maxLength = this.getMaxLength(); //Length associated with the above percent
    //Get the target angle from the Node that is the origin
    this.finalX = this.startX + sin(angle) * maxLength;
    if (angle == 0) {
      this.finalY = canvas.height - startPoint.y;
    } else {
      this.finalY = this.startY + cos(angle) * maxLength;
    }
//    console.log("branch#: " + branches.length)
//    console.log("currX: "+ this.x + "   currY: " + this.y);
//    console.log("finalX: " + this.finalX + "   finalY: " + this.finalY)
  }
  
  //Make the branch stop growing and stay at its intended final position
  stopGrowing() {
    this.growing = false;
    this.x = this.finalX;
    this.y = this.finalY;
  }
  
  //Get the max length of the arrow, could change with window resizing
  getMaxLength() {
    var maxLength = (this.maxLengthPercent/100) * windowHeight;
    return maxLength;
  }
  
  //Get the growth speed based on the angle provided, also could change with window resizing
  getGrowthSpeed(angle) {
    var growthSpeed = branchDownSpeed / cos(angle);
    return growthSpeed;
  }
  
  //Increase the length of the branch by moving its current coordinates
  grow() {
    this.x += sin(this.angle) * this.growthSpeed;
    this.y += cos(this.angle) * this.growthSpeed;
  }
  
  //Update final positions for resizing
//  updateFinalPos() {
//    
//  }
  
}

//Node blueprint
class Node {

  constructor(x, y) {
    //Node's position
    this.x = x;
    this.y = y;
    //Current radius of the node (starts at default, grows then remains default)
    this.rad = nodeRad
    this.colour = element.primaryColour;
    this.pulsing = true;  //If the node is currently growing/shrinking from creation
    this.pulseLength = 0; //Ticks since pulse began
    this.maxPulseLength = 40; //Max amount of ticks for a pulse
  }

  //Make the node increase and shrink in size (on birth)
  pulse() {
    if (this.pulseLength % 2 == 0) {
      if (this.pulseLength >= this.maxPulseLength / 2) {
        this.rad -= nodePulseGrowth;  //Shrink in 2nd half of pulse
      } else {
        this.rad += nodePulseGrowth;  //Grow in 1st half of pulse
      }
    }
    this.pulseLength++;
  }

  //When done pulsing
  stopPulsing() {
    this.pulsing = false;
  }
}

// The information of the element in which to animate
var element = {
  div: undefined,
  pos: {'x': 0, 'y': 0},
  size: {'width': 100, 'height': 100},
  bgColour: 'rgb(0, 0, 0)',
  primaryColour: 'rgb(255, 255, 255)'
};
//The information of the header div that is created
var mainDiv = {
  div: undefined,
  //leftDiv: 0,
  //rightDiv: 0,
  header: 0,
  subtext: 0,
  pos: {'x': 0, 'y': 0},
  size: {'width': 100, 'height': 100}
};
var startPoint; //Origin (first node/branches location)

//General node and branch properties
var nodeRad;
var nodePulseGrowth;
var branchWidth;
var branchDownSpeed;
//Properties of triangles (arrows) at ends of growing banches
var triHeight = 15;
var triWidth = 10;

//Array of nodes and branches on the screen
var nodes = [];
var branches = [];
var canvas;
var isMobile = false; //If the device is a mobile
var ticks = 0; //Ticks that have passed (as necessary)

function setup() {
  getDivElement();
  // Creating the canvas using the element's position and size
  canvas = createCanvas(element.size['width'], element.size['height']);
  canvas.parent(element.div);
  background(element.bgColour);
  //Add the main header
  addHeader("Gordie Levitsky", "Second Year Computer Science Student");
  
  //Setting all the base constants relative to the screen's size
  nodeRad = setNodeRad();
  nodePulseGrowth = setNodePulseGrowth();
  branchDownSpeed = setBranchDownSpeed();
  
  //Check if the device is mobile
  if (/Mobi/i.test(navigator.userAgent)) {
    is_mobile = true;
  }
  
  //Starting point of the first node
  startPoint = {
    x: element.pos['x'] + (element.size['width'] / 2),
    y: mainDiv.pos['y'] + mainDiv.size['height'] + 5
  };
  //Starting point will be translated to (0, 0)
  //Add the first node and branches at (0, 0)
  branchTree(0, 0, [true, true]);
}

function draw() {
  ticks++;
  //Clear the screen to redraw the things
  clear();
  //Gotta translate the origin every time :(
  translate(startPoint.x, startPoint.y);
  
  //Actual drawing stuff
  //Default colour to a white
  fill(230);
  //stroke(25, 25, 25);
  //noStroke();
  
  //Draw all the branches
  var numBranches = branches.length;
  var stillGrowing = false;
  for (var i = 0; i < numBranches; i++) {
    branch = branches[i];
    //Draw the line
    line(branch.startX, branch.startY, branch.x, branch.y);
    //If the bottom of the canvas is reached, make the growing stop and draw the triangles
    if (branch.y + startPoint.y >= canvas.height) {
      if (branch.growing) {
        branch.stopGrowing()
      }
      var tri = createTriangle(branches[i]);
      triangle(tri[0], tri[1], tri[2], tri[3], tri[4], tri[5]);
    }
    //If the branch is still growing, make it grow
    if (branch.growing) {
      stillGrowing = true;
      //Make it grow
      branch.grow();
      //If it's growing also draw a triangle
      var tri = createTriangle(branch);
      triangle(tri[0], tri[1], tri[2], tri[3], tri[4], tri[5]);
      //textSize(24);
      //text("" + i, branch.x, branch.y);

      //If the branch has now reached it's target length, make it stop growing
      var sideReached;
      if (abs(branch.startX) <= abs(branch.finalX) || branch.finalX == 0) {
        //If the branch is moving outwards or to the centre point
        sideReached = abs(branch.x) >= abs(branch.finalX);
      } else {
        //If the branch is moving inwards
        sideReached = abs(branch.x) <= abs(branch.finalX);
      }
      var bottomReached = branch.y >= branch.finalY;
      if (sideReached && bottomReached) {
        branch.stopGrowing();
        var angle = branch.angle;
        var taken = false;
        for (var i = 0; i < nodes.length; i++) {
          if (floor(branch.finalX) == floor(nodes[i].x) && floor(branch.finalY) == floor(nodes[i].y)) {
            taken = true;
          }
        }
        //Create new branches if this is not the downwards line
        if (!taken && angle != 0) {
          //For creating the new branches...
          var maxBranchLength = branch.getMaxLength()
          //If this must be the last branch, they will go downwards
          //If it's not the last branch, decide which branches fit and make them (going the normal diagonals)
          var spaceBelow = canvas.height - startPoint.y - branch.finalY > maxBranchLength;
          if (spaceBelow) {
            spaceOnLeft = branch.finalX + sin(-PI / 4) * maxBranchLength - 15 > -element.div.width / 2;
            spaceOnRight = branch.finalX + sin(PI / 4) * maxBranchLength + 15 < element.div.width / 2;
            branchTree(branch.finalX, branch.finalY, [spaceOnLeft, spaceOnRight]);
          } else {
            branchDown(branch.finalX, branch.finalY);
          }
        }
      } 
    }
  }

  //Draw all the nodes on top of the branches
  var stillPulsing = false;
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    ellipse(node.x, node.y, node.rad);
    //If the node is pulsing, make that happen
    if (node.pulsing) {
      stillPulsing = true;
      node.pulse();
      //If the node needs to stop pulsing, make that happen
      if (node.pulseLength >= node.maxPulseLength) {
        node.stopPulsing();
        node.rad = nodeRad;
      }
    }
  }

  //Stop drawing if nothing is changing
  if (!stillPulsing && !stillGrowing) {
    noLoop();
  }
}

function windowResized() {
  if (!isMobile) {
    //Reset the animation element's size and the canvas size
    element.size.width = windowWidth;
    element.size.height = windowHeight;
    resizeCanvas(element.size['width'], element.size['height']);
    //Deal with minor change of phone screen height somehow!!

    //Replace the mainHeader div at the centre
    mainDiv.div.center('horizontal');
    mainDiv.pos.x = (element.size['width'] - mainDiv.size['width']) / 2
    mainDiv.pos.y = element.pos['y'] + (windowHeight / 8);
    mainDiv.div.position(mainDiv.pos.x, mainDiv.pos.y);

    //Rescale the drawn tree
    //nodeRad = setNodeRad();
    //nodePulseGrowth = setNodePulseGrowth();
    //branchWidth = setBranchWidth();
    //branchDownSpeed = setBranchDownSpeed();
    //Update branches: angles, maxLengths and widths
    //Update nodes: radii, pulse sizes
  }
}

function getDivElement() {
  // Getting the element and properties from the HTML
  element.div = select("#tree-sprout-animation")
  element.pos = element.div.position();
  // Make the div span the full page
  element.div.size('width', windowWidth);
  element.div.size('height', windowHeight);
  element.size = element.div.size();
  // Setting the colours using the element's colours
  element.bgColour = element.div.style("background-color");
  element.primaryColour = element.div.style("color");
}

function addHeader(mainText, subText) {
  //Creating each of the divs and making them children of the main tree-sprout-animation div
//  mainDiv.leftDiv = createDiv('<div></div>');
//  mainDiv.leftDiv.class("col-4");
//  mainDiv.leftDiv.parent(element.div);
  
  mainDiv.div = createDiv('<h1 id="main-header">' + mainText + '</h1><hr id="head-rule"><p id="main-header">' + subText + '</p>');
//  mainDiv.div.class("col-4");
  mainDiv.div.parent(element.div);
  
//  mainDiv.rightDiv = createDiv('<div></div>');
//  mainDiv.rightDiv.class("col-4");
//  mainDiv.rightDiv.parent(element.div);
  
  //Make the main div the header and center it
  mainDiv.div.id("main-header");
  mainDiv.div.center('horizontal');
  mainDiv.size = mainDiv.div.size();
  mainDiv.pos.x = (element.size['width'] - mainDiv.size['width']) / 2
  mainDiv.pos.y = element.pos['y'] + (windowHeight / 8);
  mainDiv.div.position(mainDiv.pos.x, mainDiv.pos.y);
}
  
function setNodeRad() {
  var rad;
  //If small screen (probably mobile), map radius between 8 and 5
  if (windowWidth < 1000) {
    rad = map(windowWidth, 400, 1000, 10, 20);
  //If bigger screen, radius default to 15
  } else {
    rad = 20;
  }
  return rad;
}

function setNodePulseGrowth() {
  //Make the pulse growth related to the node's radius itself
  var growth;
  growth = floor(nodeRad / 10);
  return growth;
}

function setBranchDownSpeed() {
  var downSpeed;
  //If small screen somehow, minimum growth speed
  if (windowHeight < 1500) {
    downSpeed = 3;
  //If normal size screen, map growth speed relative to screen size
  } else {
    downSpeed = map(windowHeight, 1500, 3000, 3, 6);
  }
  return downSpeed;
}

function branchTree(x, y, newBranches) {
  //Create a new node and a pair of child branches going in opposite
  //directions at 45 degree angles from each side of the node
  nodes.push(new Node(x, y));
  for (var i = 0; i < 2; i++) {
    if (newBranches[i] != false) {
      var angle = (-PI / 4) + (PI / 2) * i;
      branches.push(new Branch(x, y, angle));
    }
  }
}

function branchDown(x, y) {
  //Create a new node and the a branch going straight down
  //Just for the last branches
  nodes.push(new Node(x, y));
  branches.push(new Branch(x, y, 0));
}

function createTriangle(branch) {
  //Get a set of coordinates for the triangles at the end of the growing branches
  var coords = []
  coords.push(branch.x, branch.y);
  //Trigonometric calculations to get the other points
  var x2 = branch.x - (sin(branch.angle) * triHeight + cos(branch.angle) * (triWidth / 2));
  var y2 = branch.y - cos(branch.angle) * triHeight + sin(branch.angle) * (triWidth / 2);
  var x3 = branch.x - (sin(branch.angle) * triHeight - cos(branch.angle) * (triWidth / 2));
  var y3 = branch.y - cos(branch.angle) * triHeight - sin(branch.angle) * (triWidth / 2);
  coords.push(x2, y2, x3, y3);
  return coords;
}