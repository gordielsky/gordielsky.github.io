//Modes that don't work
//angleMode(DEGREES);
//rectMode(CENTER);

//Branch and Node Objects
class Branch {
  
  constructor(x, y, angle) {
    //Branches have a lot of properties
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.colour = element.primaryColour;
    this.growing = true; //If the length should keep increasing
    this.growthSpeed = this.getGrowthSpeed(angle);
    this.maxLengthPercent = 20;
    var maxLength = this.getMaxLength();
    //Get the target angle from the Node that is the origin
    this.finalX = this.startX + sin(angle) * maxLength;
    this.finalY = this.startY + cos(angle) * maxLength;
//    console.log("branch#: " + branches.length)
//    console.log("currX: "+ this.x + "   currY: " + this.y);
//    console.log("finalX: " + this.finalX + "   finalY: " + this.finalY)
  }
  
  stopGrowing() {
    this.growing = false;
    this.x = this.finalX;
    this.y = this.finalY;
  }
  
  getMaxLength() {
    var maxLength = (this.maxLengthPercent/100) * windowHeight;
    return maxLength;
  }
  
  getGrowthSpeed(angle) {
    var growthSpeed = branchDownSpeed / cos(angle);
    return growthSpeed;
  }
  
  grow() {
    this.x += sin(this.angle) * this.growthSpeed;
    this.y += cos(this.angle) * this.growthSpeed;
  }
  
  //Update final positions for resizing
//  updateFinalPos() {
//    
//  }
  
}

class Node {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rad = nodeRad
    this.colour = element.primaryColour;
    this.pulsing = true;
    this.pulseLength = 0;
    this.maxPulseLength = 40;
  }
  
  pulse() {
    if (this.pulseLength % 2 == 0) {
      if (this.pulseLength >= this.maxPulseLength / 2) {
        this.rad -= nodePulseGrowth;
      } else {
        this.rad += nodePulseGrowth;
      }
    }
    this.pulseLength++;
  }
  
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
var triHeight = 15;
var triWidth = 10;
//Array of nodes and branches on the screen
var nodes = [];
var branches = [];
var ticks = 0;

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
  //Default colour to a white and also ditch the stroke
  fill(230);
  //stroke(25, 25, 25);
  //noStroke();
  
  //Draw all the branches
  var numBranches = branches.length;
  for (var i = 0; i < numBranches; i++) {
    branch = branches[i];
    //Draw the line
    line(branch.startX, branch.startY, branch.x, branch.y);
    //If the branch is still growing, make it grow
    if (branch.growing) {
      //Make it grow
      branch.grow();
      //If it's growing also draw a triangle
      var tri = createTriangle(branch);
      triangle(tri[0], tri[1], tri[2], tri[3], tri[4], tri[5]);
      //Make draw stop if the bottom of the canvas is reached
      if (branch.y >= element.div.height) {
        noLoop();
      }
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
        if (i == 4) {
          console.log("worked")
        }
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
          var spaceBelow = element.div.height - startPoint.y - branch.finalY > maxBranchLength;
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
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    ellipse(node.x, node.y, node.rad);
    //If the node is pulsing, make that happen
    if (node.pulsing) {
      node.pulse();
      //If the node needs to stop pulsing, make that happen
      if (node.pulseLength >= node.maxPulseLength) {
        node.stopPulsing();
        node.rad = nodeRad;
      }
    }
  }
}

function windowResized() {
  //Reset the animation element's size and the canvas size
  element.size.width = windowWidth;
  element.size.height = windowHeight;
  resizeCanvas(element.size['width'], element.size['height']);

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
  nodes.push(new Node(x, y));
  for (var i = 0; i < 2; i++) {
    if (newBranches[i] != false) {
      var angle = (-PI / 4) + (PI / 2) * i;
      branches.push(new Branch(x, y, angle));
    }
  }
}

function branchDown(x, y) {
  nodes.push(new Node(x, y));
  branches.push(new Branch(x, y, 0));
}

function createTriangle(branch) {
  var coords = []
  coords.push(branch.x, branch.y);
  var x2 = branch.x - (sin(branch.angle) * triHeight + cos(branch.angle) * (triWidth / 2));
  var y2 = branch.y - cos(branch.angle) * triHeight + sin(branch.angle) * (triWidth / 2);
  var x3 = branch.x - (sin(branch.angle) * triHeight - cos(branch.angle) * (triWidth / 2));
  var y3 = branch.y - cos(branch.angle) * triHeight - sin(branch.angle) * (triWidth / 2);
  coords.push(x2, y2, x3, y3);
  return coords;
}