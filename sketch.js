// deno-lint-ignore-file
let galaxy;
let stars = [];
let dragging = false;
let draggedPlanet = null;
let zoomFactor = 1;
let originX, originY;
let createBlackHoleButton, createSolarSystemButton;
let clickedInfo = '';

function setup() {
  createCanvas(windowWidth, windowHeight);
  galaxy = new Galaxy();
  galaxy.createSolarSystems(8);
  galaxy.createBlackHoles(0);
  createStars(3000);
  originX = width / 2;
  originY = height / 2;

  createButtons();
}

function draw() {
  drawGradientBackground();
  translate(width / 2, height / 2);
  scale(zoomFactor);
  translate(-originX, -originY);
  displayStars();
  galaxy.update();
  galaxy.display();
  handleCameraMovement();
  displayClickedInfo();
}

function drawGradientBackground() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(0, 0, 50), color(0, 0, 0), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

function createStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    let star = {
      x: random(-width * 5, width * 5),
      y: random(-height * 5, height * 5),
      size: random(1, 3),
      brightness: random(150, 255)
    };
    stars.push(star);
  }
}

function displayStars() {
  for (let star of stars) {
    drawGlowingStar(star.x, star.y, star.size, star.brightness);
  }
}

function drawGlowingStar(x, y, size, brightness) {
  noStroke();
  let alpha = map(brightness, 150, 255, 50, 150);
  for (let i = size; i > 0; i--) {
    fill(255, 255, 255, alpha / i);
    ellipse(x, y, i * 2);
  }
}

function handleCameraMovement() {
  let speed = 10 / zoomFactor;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    originX -= speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    originX += speed;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    originY -= speed;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    originY += speed;
  }
}

function mousePressed() {
  let mouseXTrans = (mouseX - width / 2) / zoomFactor + originX;
  let mouseYTrans = (mouseY - height / 2) / zoomFactor + originY;

  clickedInfo = ''; 

  for (let solarSystem of galaxy.solarSystems) {
    // Check if a planet is clicked
    for (let planet of solarSystem.planets) {
      if (dist(mouseXTrans, mouseYTrans, planet.position.x, planet.position.y) < planet.radius) {
        dragging = true;
        draggedPlanet = planet;
        clickedInfo = `Planet - Mass: ${planet.mass.toFixed(2)}, Radius: ${planet.radius.toFixed(2)}`;
        return;
      }
    }
    // Check if the star is clicked
    if (dist(mouseXTrans, mouseYTrans, solarSystem.star.position.x, solarSystem.star.position.y) < solarSystem.star.radius) {
      clickedInfo = `${solarSystem.star.type} - Mass: ${solarSystem.star.mass.toFixed(2)}, Radius: ${solarSystem.star.radius.toFixed(2)}`;
      return;
    }
  }

  // Check if a black hole is clicked
  for (let blackHole of galaxy.blackHoles) {
    if (dist(mouseXTrans, mouseYTrans, blackHole.position.x, blackHole.position.y) < blackHole.eventHorizonRadius) {
      clickedInfo = `Black Hole - Mass: ${blackHole.mass.toFixed(2)}, Event Horizon Radius: ${blackHole.eventHorizonRadius.toFixed(2)}`;
      return;
    }
  }


  let newPlanet = new Planet(mouseXTrans, mouseYTrans, random(5, 20), color(random(255), random(255), random(255)));
  let solarSystem = galaxy.getNearestSolarSystem(mouseXTrans, mouseYTrans);
  let distance = dist(newPlanet.position.x, newPlanet.position.y, solarSystem.star.position.x, solarSystem.star.position.y);
  let angle = atan2(newPlanet.position.y - solarSystem.star.position.y, newPlanet.position.x - solarSystem.star.position.x);
  let orbitalSpeed = sqrt((0.4 * solarSystem.star.mass) / distance);
  newPlanet.velocity = createVector(-sin(angle) * orbitalSpeed, cos(angle) * orbitalSpeed);
  solarSystem.planets.push(newPlanet);
}

function mouseDragged() {
  if (dragging && draggedPlanet) {
    let mouseXTrans = (mouseX - width / 2) / zoomFactor + originX;
    let mouseYTrans = (mouseY - height / 2) / zoomFactor + originY;
    draggedPlanet.position.x = mouseXTrans;
    draggedPlanet.position.y = mouseYTrans;
  }
}

function mouseReleased() {
  dragging = false;
  draggedPlanet = null;
}

function mouseWheel(event) {
  zoomFactor += event.delta * 0.001;
  zoomFactor = constrain(zoomFactor, 0.5, 1.5);
}

function createButtons() {
  createBlackHoleButton = createButton('Create Black Hole');
  createBlackHoleButton.position(10, 10);
  createBlackHoleButton.mousePressed(createBlackHole);

  createSolarSystemButton = createButton('Create Solar System');
  createSolarSystemButton.position(10, 40);
  createSolarSystemButton.mousePressed(createSolarSystem);
}

function createBlackHole() {
  let x = originX;
  let y = originY;
  let blackHole = new BlackHole(x, y, random(100, 200), 50);
  galaxy.blackHoles.push(blackHole);
}

function createSolarSystem() {
  let x = originX;
  let y = originY;
  let starType = random(['Sun', 'WhiteDwarf', 'RedGiant', 'NeutronStar']);
  let star;
  if (starType === 'Sun') {
    star = new Sun(x, y);
  } else if (starType === 'WhiteDwarf') {
    star = new WhiteDwarf(x, y);
  } else if (starType === 'RedGiant') {
    star = new RedGiant(x, y);
  } else if (starType === 'NeutronStar') {
    star = new NeutronStar(x, y);
  }
  let solarSystem = new SolarSystem(x, y, star);
  solarSystem.createPlanets(8);
  galaxy.solarSystems.push(solarSystem);
}

function displayClickedInfo() {
  if (clickedInfo) {
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(clickedInfo, width / 2, height / 2);
  }
}

class Galaxy {
  constructor() {
    this.solarSystems = [];
    this.blackHoles = [];
  }

  createSolarSystems(numSolarSystems) {
    for (let i = 0; i < numSolarSystems; i++) {
      let x, y;
      if (i === 0) {
        x = originX;
        y = originY;
      } else {
        x = random(-width * 4, width * 4);
        y = random(-height * 4, height * 4);
      }
      let starType = random(['Sun', 'WhiteDwarf', 'RedGiant', 'NeutronStar']);
      let star;
      if (starType === 'Sun') {
        star = new Sun(x, y);
      } else if (starType === 'WhiteDwarf') {
        star = new WhiteDwarf(x, y);
      } else if (starType === 'RedGiant') {
        star = new RedGiant(x, y);
      } else if (starType === 'NeutronStar') {
        star = new NeutronStar(x, y);
      }
      let solarSystem = new SolarSystem(x, y, star);
      solarSystem.createPlanets(8);
      this.solarSystems.push(solarSystem);
    }
  }

  createBlackHoles(numBlackHoles) {
    for (let i = 0; i < numBlackHoles; i++) {
      let x = random(-width * 4, width * 4);
      let y = random(-height * 4, height * 4);
      let blackHole = new BlackHole(x, y, random(100, 200), 50);
      this.blackHoles.push(blackHole);
    }
  }

  getNearestSolarSystem(x, y) {
    let nearestSolarSystem = null;
    let minDist = Infinity;
    for (let solarSystem of this.solarSystems) {
      let d = dist(x, y, solarSystem.star.position.x, solarSystem.star.position.y);
      if (d < minDist) {
        minDist = d;
        nearestSolarSystem = solarSystem;
      }
    }
    return nearestSolarSystem;
  }

  update() {
    for (let solarSystem of this.solarSystems) {
      solarSystem.update();
    }
    for (let blackHole of this.blackHoles) {
      blackHole.update();
    }
  }

  display() {
    for (let solarSystem of this.solarSystems) {
      solarSystem.display();
    }
    for (let blackHole of this.blackHoles) {
      blackHole.display();
    }
  }
}

class SolarSystem {
  constructor(x, y, star) {
    this.star = star;
    this.planets = [];
  }

  createPlanets(numPlanets) {
    for (let i = 0; i < numPlanets; i++) {
      let distance = random(100, 300);
      let angle = random(TWO_PI);
      let x = this.star.position.x + distance * cos(angle);
      let y = this.star.position.y + distance * sin(angle);
      let mass = random(5, 20);
      let planet = new Planet(x, y, mass, color(random(255), random(255), random(255)));

      let orbitalSpeed = sqrt((0.4 * this.star.mass) / distance);
      planet.velocity = createVector(-sin(angle) * orbitalSpeed, cos(angle) * orbitalSpeed);

      this.planets.push(planet);
    }
  }

  update() {
    for (let i = this.planets.length - 1; i >= 0; i--) {
      let planet = this.planets[i];
      let force = this.star.attract(planet);
      planet.applyForce(force);

      for (let blackHole of galaxy.blackHoles) {
        let blackHoleForce = blackHole.attract(planet);
        planet.applyForce(blackHoleForce);

        if (blackHole.isInsideEventHorizon(planet)) {
          this.planets.splice(i, 1);
          break;
        }
      }

      planet.update();
    }

    for (let i = this.planets.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        let planetA = this.planets[i];
        let planetB = this.planets[j];
        if (planetA.checkCollision(planetB)) {
          let newPlanet = planetA.merge(planetB);
          this.planets.splice(i, 1);
          this.planets.splice(j, 1);
          this.planets.push(newPlanet);
          break;
        }
      }
    }
  }

  display() {
    this.star.display();
    for (let planet of this.planets) {
      planet.display();
    }
  }
}

class Planet {
  constructor(x, y, mass, col) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass = mass;
    this.radius = sqrt(mass);
    this.color = col;
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
  }

  attract(other) {
    let force = p5.Vector.sub(this.position, other.position);
    let distance = constrain(force.mag(), 20, 200);
    force.normalize();
    let strength = (0.4 * this.mass * other.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }

  checkCollision(other) {
    let distance = p5.Vector.dist(this.position, other.position);
    return distance < (this.radius + other.radius);
  }

  merge(other) {
    let newMass = this.mass + other.mass;
    let newRadius = sqrt(this.radius * this.radius + other.radius * other.radius);
    let newColor = lerpColor(this.color, other.color, 0.5);

    let newPosition = p5.Vector.add(this.position, other.position).div(2);

    let newVelocity = p5.Vector.add(
      p5.Vector.mult(this.velocity, this.mass),
      p5.Vector.mult(other.velocity, other.mass)
    ).div(newMass);

    let newPlanet = new Planet(newPosition.x, newPosition.y, newMass, newColor);
    newPlanet.velocity = newVelocity;
    return newPlanet;
  }
}

class Star {
  constructor(x, y, mass, col, type) {
    this.position = createVector(x, y);
    this.mass = mass;
    this.radius = sqrt(mass);
    this.color = col;
    this.type = type;
  }

  attract(other) {
    let force = p5.Vector.sub(this.position, other.position);
    let distance = constrain(force.mag(), 20, 200);
    force.normalize();
    let strength = (0.4 * this.mass * other.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  display() {
    // Glow effect
    noStroke();
    for (let r = this.radius * 2; r > 0; r -= 2) {
      let alpha = map(r, 0, this.radius * 2, 0, 255);
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha / 4);
      ellipse(this.position.x, this.position.y, r);
    }
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}

class Sun extends Star {
  constructor(x, y) {
    super(x, y, 50, color(255, 204, 0), 'Sun');
  }
}

class WhiteDwarf extends Star {
  constructor(x, y) {
    super(x, y, 30, color(200, 200, 255), 'White Dwarf');
  }
}

class RedGiant extends Star {
  constructor(x, y) {
    super(x, y, 70, color(255, 100, 100), 'Red Giant');
  }
}

class NeutronStar extends Star {
  constructor(x, y) {
    super(x, y, 40, color(150, 150, 255), 'Neutron Star');
  }
}

class BlackHole {
  constructor(x, y, mass, eventHorizonRadius) {
    this.position = createVector(x, y);
    this.mass = mass;
    this.eventHorizonRadius = eventHorizonRadius;
    this.particles = [];
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < 100; i++) {
      let angle = random(TWO_PI);
      let distance = random(this.eventHorizonRadius, this.eventHorizonRadius * 2);
      let x = this.position.x + distance * cos(angle);
      let y = this.position.y + distance * sin(angle);
      this.particles.push(createVector(x, y));
    }
  }

  attract(other) {
    let force = p5.Vector.sub(this.position, other.position);
    let distance = constrain(force.mag(), 50, 300);
    force.normalize();
    let strength = (50 * this.mass * other.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  isInsideEventHorizon(planet) {
    let distance = p5.Vector.dist(this.position, planet.position);
    return distance < this.eventHorizonRadius;
  }

  update() {
    for (let particle of this.particles) {
      let force = p5.Vector.sub(this.position, particle);
      force.setMag(random(0.1, 0.5));
      particle.add(force);

      let distance = p5.Vector.dist(this.position, particle);
      if (distance < this.eventHorizonRadius) {
        let angle = random(TWO_PI);
        let distance = random(this.eventHorizonRadius, this.eventHorizonRadius * 2);
        particle.set(this.position.x + distance * cos(angle), this.position.y + distance * sin(angle));
      }
    }
  }

  display() {
    fill(0);
    noStroke();
    ellipse(this.position.x, this.position.y, this.eventHorizonRadius * 2);

    noFill();
    stroke(255, 204, 0);
    strokeWeight(2);
    ellipse(this.position.x, this.position.y, this.eventHorizonRadius * 2 + 10);

    fill(255, 204, 0, 150);
    for (let particle of this.particles) {
      ellipse(particle.x, particle.y, 2);
    }
  }
}