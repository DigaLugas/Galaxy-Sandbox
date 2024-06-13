
# Galaxy Simulation

## Overview

This project is a galaxy simulation using p5.js, where you can visualize and interact with a dynamic galaxy consisting of stars, planets, and black holes. The simulation allows users to explore the galaxy, zoom in and out, and create new celestial bodies.

## Features

- **Galaxy Creation**: The galaxy is initialized with a specified number of solar systems and black holes.
- **Star Types**: Includes different types of stars such as Sun, White Dwarf, Red Giant, and Neutron Star.
- **Planetary Systems**: Each solar system contains a star and multiple orbiting planets.
- **Black Holes**: Can be created dynamically and have an event horizon that affects nearby planets.
- **Interactive Exploration**: Users can drag and move planets, zoom in and out, and move the camera.
- **Dynamic Visualization**: Stars and planets are rendered with glowing effects, and planets can merge upon collision.

## Controls

- **Mouse Click**: Click on planets or stars to get information about them.
- **Mouse Drag**: Drag planets to move them.
- **Mouse Wheel**: Zoom in and out.
- **Arrow Keys / WASD**: Move the camera.

## Buttons

- **Create Black Hole**: Adds a new black hole at the center of the canvas.
- **Create Solar System**: Adds a new solar system at the center of the canvas.

## Code Structure

- **setup()**: Initializes the canvas, galaxy, and user interface elements.
- **draw()**: Main draw loop that renders the galaxy and handles user interactions.
- **Galaxy Class**: Manages the collection of solar systems and black holes.
- **SolarSystem Class**: Represents a solar system with a star and orbiting planets.
- **Star Class**: Base class for different types of stars.
  - **Sun, WhiteDwarf, RedGiant, NeutronStar**: Subclasses of Star with specific properties.
- **Planet Class**: Represents a planet with mass, velocity, and position.
- **BlackHole Class**: Represents a black hole with an event horizon and particle effects.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/DigaLugas/Galaxy-Sandbox.git
    ```

2. Navigate to the project directory:
    ```bash
    cd galaxy-sandbox
    ```

3. Open `index.html` in your browser to run the simulation.

## Usage

- Run the simulation by opening `index.html` in a web browser.
- Use the mouse and keyboard controls to explore and interact with the galaxy.
- Click the buttons to create new black holes and solar systems.


## Acknowledgements

- [p5.js](https://p5js.org/) - The library used for graphics and interactions.

## Contact

For any questions or feedback, please contact [lucasgustavorodrigues10@gmail.com].

```
