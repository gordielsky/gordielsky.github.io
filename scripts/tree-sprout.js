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
    this.colour = primaryColour;
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
    this.colour = primaryColour;
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

var startPoint; //Origin (first node/branches location)

//General node and branch properties
var nodeRad;
var nodePulseGrowth;
var branchWidth;
var branchDownSpeed;
var maxLengthPercent = 20;
//Properties of triangles (arrows) at ends of growing banches
var triHeight = 15;
var triWidth = 10;

//Array of nodes and branches on the screen
var nodes = [];
var branches = [];
//Canvas and tick variables
var canvas;
var bgColour;
var primaryColour;
var isMobile = false; //If the device is a mobile
var ticks = 0; //Ticks that have passed (as necessary)

function setup() {
  getDivElement();
  // Creating the canvas using the element's position and size
  canvas = createCanvas(windowWidth, windowHeight - 15);
  background(bgColour);
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
}

function mousePressed() {
  //Reset the canvas
  clear()
  nodes = []
  branches = []
  
  //Set the new starting point
  startPoint = {
    x: mouseX,
    y: mouseY
  };
  
  //Branch from the new point, which will be translated to 0, 0
  branchTree(0, 0);
}

function draw() {
  ticks++;
  //Clear the screen to redraw the things
  clear();
  //Gotta translate the origin every time :(
  translate(startPoint.x, startPoint.y);
  
  //Actual drawing stuff
  //Default colour to a white and also ditch the stroke
  fill(primaryColour);
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
        var taken = false;
        for (var i = 0; i < nodes.length; i++) {
          if (floor(branch.finalX) == floor(nodes[i].x) && floor(branch.finalY) == floor(nodes[i].y)) {
            taken = true;
          }
        }
        //Create new branches if this is not the downwards line
        if (!taken && branch.angle != 0) {
          //For creating the new branches...
          var maxBranchLength = branch.getMaxLength()
          //If this must be the last branch, they will go downwards
          //If it's not the last branch, decide which branches fit and make them (going the normal diagonals)
          var spaceBelow = canvas.height - startPoint.y - branch.finalY > maxBranchLength;
          if (spaceBelow) {
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

//function windowResized() {
//  //Only mess around with resizes on desktop sites
//  if (!isMobile) {
//    //Reset the canvas size
//    resizeCanvas(windowWidth, windowHeight]);
//
//    //Rescale the drawn tree
//    //nodeRad = setNodeRad();
//    //nodePulseGrowth = setNodePulseGrowth();
//    //branchWidth = setBranchWidth();
//    //branchDownSpeed = setBranchDownSpeed();
//    //Update branches: angles, maxLengths and widths
//    //Update nodes: radii, pulse sizes
//  }
//}
  
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
  
function getMaxLength() {
  //Get the max length of the arrow, could change with window resizing
  var maxLength = (maxLengthPercent/100) * canvas.height;
  return maxLength;
}

function branchTree(x, y) {
  //Create a new node and a pair of child branches going in opposite
  //directions at 45 degree angles from each side of the node
  nodes.push(new Node(x, y));
  //Check if there is space for the branch on either side of the new node
  var spaceOnLeft = startPoint.x + x + sin(-PI / 4) * getMaxLength() - 15 > 0;
  var spaceOnRight = startPoint.x + x + sin(PI / 4) * maxBranchLength + 15 < canvas.width;
  //If there is space in that direction, create the branch in that direction
  if (spaceOnLeft) {
    branches.push(new Branch(x, y, (-PI / 4)));
  }
  if (spaceOnRight) {
    branches.push(new Branch(x, y, (PI / 4)));
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