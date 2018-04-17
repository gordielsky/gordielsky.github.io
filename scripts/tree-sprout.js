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
    //Get the target angle from the Node that is the origin
    this.finalX = this.startX + sin(angle) * branchLength;
    if (angle == 0) {
      this.finalY = canvas.height - startPoint.y;
    } else {
      this.finalY = this.startY + cos(angle) * branchLength;
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

//Origin (node/branch starting position)
var startPoint = {
  x: 0,
  y: 0
};

//General node and branch properties
var nodeRad;
var nodePulseGrowth;
var branchLength = 100;
var branchDownSpeed;
var maxLengthPercent = 20;
//Properties of triangles (arrows) at ends of growing banches
var triHeight = 15;
var triWidth = 10;

//Array of nodes and branches on the screen
var nodes = [];
var branches = [];
//Sliders for colour, node size and branch length
var redBGSlider;
var greenBGSlider;
var blueBGSlider;
var redMainSlider;
var greenMainSlider;
var blueMainSlider;
var radSlider;
var lengthSlider;
//Canvas and tick variables
var canvas;
var bgColour = "rgb(0, 52, 153)";
var primaryColour = "rgb(230, 230, 230)";
var isMobile = false; //If the device is a mobile
var ticks = 0; //Ticks that have passed (as necessary)

function setup() {
  //getDivElement();
  // Creating the canvas using the element's position and size
  canvas = createCanvas(windowWidth, windowHeight);
  //Add the main header
  //addHeader("Gordie Levitsky", "Second Year Computer Science Student");
  
  //Setting all the base constants relative to the screen's size
  nodeRad = setNodeRad();
  nodePulseGrowth = setNodePulseGrowth();
  branchDownSpeed = setBranchDownSpeed();
  
  //Check if the device is mobile
  if (/Mobi/i.test(navigator.userAgent)) {
    isMobile = true;
  }
  
  if (!isMobile) {
    //Background colour sliders
    redBGSlider = createSlider(0, 255, 0);
    redBGSlider.position(canvas.width - 300, canvas.height/8)
    greenBGSlider = createSlider(0, 255, 52);
    greenBGSlider.position(canvas.width - 300, 2 * canvas.height/8)
    blueBGSlider = createSlider(0, 255, 153);
    blueBGSlider.position(canvas.width - 300, 3 * canvas.height/8)

    //Primary colour sliders
    redMainSlider = createSlider(0, 255, 230);
    redMainSlider.position(canvas.width - 150, canvas.height/8)
    greenMainSlider = createSlider(0, 255, 230);
    greenMainSlider.position(canvas.width - 150, 2 * canvas.height/8)
    blueMainSlider = createSlider(0, 255, 230);
    blueMainSlider.position(canvas.width - 150, 3 * canvas.height/8)

    //Node radius and branch length sliders
    radSlider = createSlider(5, 50, nodeRad);
    radSlider.position(canvas.width - 225, 4 * canvas.height/8)
    lengthSlider = createSlider(30, 300, branchLength);
    lengthSlider.position(canvas.width - 225, 5 * canvas.height/8)
  }
}

function mousePressed() {
  if (isMobile || (!isMobile && !onSlider())) {
    //Reset the canvas
    clear();
    nodes = [];
    branches = [];
    if (!isMobile) {
      nodeRad = radSlider.value();
      branchLength = lengthSlider.value();
    }

    //Set the new starting point
    startPoint = {
      x: mouseX,
      y: mouseY
    };

    //Branch from the new point, which will be translated to 0, 0
    branchTree(0, 0);
  }
}

function draw() {
  ticks++;
  //Clear the screen to redraw the things
  clear();
  if (!isMobile) {
    //Reset the main colours
    bgColour = "rgb(" + redBGSlider.value() + ", " + greenBGSlider.value() + ", " + blueBGSlider.value() + ")";
    primaryColour = "rgb(" + redMainSlider.value() + ", " + greenMainSlider.value() + ", " + blueMainSlider.value() + ")";
  }
  background(bgColour);
  
  //Actual drawing stuff
  //Default colour to a white and also ditch the stroke
  fill(primaryColour);
  //noStroke();
  
  if (!isMobile) {
    //Draw text around the sliders
    textSize(16);
    text('Background Colour', redBGSlider.x, redBGSlider.y - 10);
    text('Foreground Colour', redMainSlider.x, redMainSlider.y - 10);
    text('R', redBGSlider.x - 15, redBGSlider.y + 16);
    text('G', greenBGSlider.x - 15, greenBGSlider.y + 16);
    text('B', blueBGSlider.x - 15, blueBGSlider.y + 16);
    text('Node Radius', radSlider.x, radSlider.y - 10);
    text('Branch Length', lengthSlider.x, lengthSlider.y - 10);
  }
  
  //Gotta translate the origin every time :(
  translate(startPoint.x, startPoint.y);
  
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
//        console.log(branchLength);
//        console.log("x: " + branch.x + "   y: " + branch.y);
//        console.log("finalX: " + branch.finalX + "   finalY: " + branch.finalY);
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
          //If this must be the last branch, they will go downwards
          //If it's not the last branch, decide which branches fit and make them (going the normal diagonals)
          branchTree(branch.finalX, branch.finalY);
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
  if (!stillGrowing && !stillPulsing && branches.length != 0) {
    for (var i = branches.length - 1; i >= 0 && branches[i].angle == 0; i--) {
      var tri = createTriangle(branches[i]);
      triangle(tri[0], tri[1], tri[2], tri[3], tri[4], tri[5]);
    }
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
  //Create a new node and branches from the node
  nodes.push(new Node(x, y));
  var spaceBelow = canvas.height - startPoint.y - y > branchLength;
  if (spaceBelow) {
    //Create a pair of child branches going in opposite
    //directions at 45 degree angles from each side of the node
    var spaceOnLeft = startPoint.x + x + sin(-PI / 4) * branchLength - 15 > 0;
    var spaceOnRight = startPoint.x + x + sin(PI / 4) * branchLength + 15 < canvas.width;
    //If there is space in that direction, create the branch in that direction
    if (spaceOnLeft) {
      branches.push(new Branch(x, y, (-PI / 4)));
    }
    if (spaceOnRight) {
      branches.push(new Branch(x, y, (PI / 4)));
    }
  } else {
    //Create a new node and the a branch going straight down
    //Just for the last branches
    nodes.push(new Node(x, y));
    branches.push(new Branch(x, y, 0));
  }
  //Check if there is space for the branch on either side of the new node
  
}

function branchDown(x, y) {
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

function onSlider() {
  var isOnSlider = false;
  var sliders = [redBGSlider, greenBGSlider, blueBGSlider, redMainSlider, greenMainSlider, blueMainSlider, radSlider, lengthSlider];
  for (var i = 0; i < sliders.length && !isOnSlider; i++) {
    slider = sliders[i];
    if (mouseX > slider.x && mouseX < slider.x + slider.width && mouseY > slider.y && mouseY < slider.y + slider.height) {
      isOnSlider = true
    }
  }
  return isOnSlider
}