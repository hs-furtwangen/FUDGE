<a href="https://github.com/hs-furtwangen/FUDGE"><img src="https://JirkaDellOro.github.io/FUDGE/Miscellaneous/Logo/FudgeLogoText.png" onload="document.querySelector('h1').style.visibility='hidden'"/></a>

# Welcome!

FUDGE is a lightweight open-source game engine and editor created for educating students in an academic environment in the field of design and development of games and highly interactive applications. It may also be used as a rapid prototyping tool to easily convey and evaluate ideas for applications and games, as well as a tool to create educational games.

Check out these examples to see what can be achieved with FUDGE:

<!--
- [GameZone](https://games.dm.hs-furtwangen.de/GameZone/): Visit the GameZone to explore a selection of applications created by students using FUDGE. You can filter for "FUDGE" in the technology dropdown to see FUDGE-powered projects.
-->
- [Prima-Lectures](https://github.com/JirkaDellOro/Prima#examples): The Prima-Lectures repository contains material from the Prototyping Interactive Media-Applications and Games lectures. You can find examples and resources related to FUDGE there.
- [UfoUndLost](https://JirkaDellOro.github.io/UfoundLost/UfoundLost.html): UfoUndLost is a project created at the GlobalGameJam 2021 using FUDGE. Take a look to see how FUDGE was utilized in this game jam submission.
- [Tsentris](https://jirkadelloro.github.io/Tsentris/): Tsentris started as a lecture project in the Prima-Lecture and has been taken further to become a small 3D-Tetris playable also on mobile devices. Connect the blocks to existing ones, 3 or more connected blocks yield points and disappear while the remaining blocks shift towards the center.

# Get Started

To start creating with FUDGE, follow these steps:

## Prerequisites

Before installing and running FUDGE, make sure you have the following prerequisites:

- **Node.js**: Node.js is required to install and run FUDGE. You can download and install Node.js from the [official Node.js website](https://nodejs.org/). Follow the installation instructions for your operating system.

- **TypeScript**: While not strictly required, TypeScript is recommended for creating custom scripts for FUDGE. You can install TypeScript globally using the command `npm install -g typescript`. Alternatively, you can also use JavaScript to create scripts.

## Installation

Once you have the prerequisites set up, follow these steps to install FUDGE:

1. Head over to [Releases](https://github.com/hs-furtwangen/FUDGE/releases) and download the latest version of `fudge.zip`.
2. Unpack the `fudge.zip` file to a location of your choice on your computer.
3. Install the required node modules to run FUDGE by running `npm install --omit=dev` in a terminal within the folder containing FUDGE or by invoking `install.bat` (on Windows).

Or alternatively clone this repository and proceed with step 3. If you don't need the whole history of the repository you can use the `depth` parameter while cloning to reduce the download size:
```
git clone --depth=1 https://github.com/hs-furtwangen/FUDGE.git
```

## Start

To start the FUDGE editor, you have multiple options:

- Type `electron Editor/Electron` in the terminal.
- Run `npm start` in the terminal.
- Double-click the `FUDGE.bat` file (on Windows).

![FUDGE Editor](https://JirkaDellOro.github.io/FUDGE/Miscellaneous/Screenshots/Editor.png)

Once you have the editor up and running, you can start creating assets in the project panel and build graphs in the graph panel. The editor is fully controlled by the menu bar, and you can right-click in various views for context menus and use drag-and-drop between the views. Take advantage of the hints in the views to guide you.

If you prefer to start without the editor, you can include the script `FudgeCore.js` in the head of your HTML page for a minimal setup. Check out this [example of a minimal scene on CodePen](https://codepen.io/JirkaDellOro/pen/VwzveRP) to see how to set it up.

# Resources

To learn more about FUDGE, explore the following resources:

## Wiki

Browse through the [Wiki](https://github.com/hs-furtwangen/FUDGE/wiki) to gain an intuitive understanding of FUDGE's core concepts and inner workings.

## Test

Explore the tests to examine isolated functionalities of FUDGE and see code in action. Run your local clone with a local server or visit the [Test](https://hs-furtwangen.github.io/FUDGE/Test) page.

## Documentation

Refer to the following documentation and references for in-depth information about different modules of FUDGE:

- [Aid](https://hs-furtwangen.github.io/FUDGE/Documentation/Reference/Aid/modules/FudgeAid.html)
- [Core](https://hs-furtwangen.github.io/FUDGE/Documentation/Reference/Core/modules/FudgeCore.html)
- [Net](https://hs-furtwangen.github.io/FUDGE/Documentation/Reference/Net/index.html)
- [OIMO.js](https://github.com/lo-th/Oimo.js)
- [UserInterface](https://hs-furtwangen.github.io/FUDGE/Documentation/Reference/UserInterface/modules/FudgeUserInterface.html)

# Repository Overview

The FUDGE repository consists of the following folders, which contain different functionalities.

## Editor

The directory of the actual standalone editor, which can be executed with Electron or packed as an executable using an Electron packager. The editor helps set up projects and create complex scenes. The resulting graph and the created resources are stored in the "Internal.json" file, and the "index.html" file serves as the main file for the project.

## Source

### Aid

Contains collections of classes for convenience, bundling, and simplifying common procedures, as well as experimental features that may become a core part in the future.

### Core

Contains the core functionality of FUDGE needed to create games. It implements an entity component system to build scene graphs, prepares its content for rendering with WebGL2 and WebAudio, manages game loops and time, offers some standard meshes, shaders, a lighting system, handles user input and keyframe animation, serialization, and more. For many games, working with this module is sufficient.

Refer to the [FUDGECoreClassdiagram.svg](Documentation/Design/FUDGECoreClassdiagram.svg?raw=1) diagram for an overview of its structure.

### Net

Contains components for gaming over networks. It comes with a core implementation of a server and a client that dispatch events with a standardized message format. Clients connect to the server via WebSockets and to each other via RTC, creating peer-to-peer connections. Clients and server offer standard functionality to build a full mesh, where each client is connected to every other client, or an authoritative host structure, where one client is connected to all others and serves as the central hub for information.

### UserInterface

Contains classes for easy and automatic creation of graphical interfaces using the mutator concept (see Wiki). This module is heavily used in the editor and can be used and extended for games.

# Call for papers
## ToDo
- Cameratransformation, Axonometry
- Diegetic User-Interface
- Grapheditor/Wiring for Shader and Animation
- Importer for standard file formats
- Runtime-Recording for Replay
- Selection-Sets to store temporary Groups
- Advanced texturing
- Input-Manager  
- Image-Tracking
- Pathfinding System
- Procedural 3D-Assets

## In Progress

## Done  

| Name               | Area                              |
|--------------------|-----------------------------------|
| Robel Teklezgi     | Foundation WebGL/Angular/Electron |
| Jascha Karagöl     | Foundation Scenetree              |
| Kathrin Fuhrer     | AR-Core with FUDGE and Electron   |
| Lukas Scheuerle    | Sketch- and Animation System      |
| Thomas Dorner      | Foundation Audio                  |
| Falco Böhnke       | Net-Components                    |
| Monika Galkewitsch | UI-Components                     |
| Lea Stegk          | UI-Design                         |
| Elke Scherffius    | Tutorials                         |
| Marko Fehrenbach   | Physics                           |
| Jonas Plotzky      | Particlesystem                    |
| Robin Schwab       | Modeller                          |
| Luis Keck          | Shader-System                     |
| Marius König       | Integration Golden Layout 2       |
| Moritz Beaugrand   | Terrain                           |
| Matthias Roming    | Skeleton System & glTF Importer   |
| Jonas Plotzky      | Particle & Animation Editor       |
| Matthias Roming      | Skeletal Animation |
| Valentin Schnidtberger | VR Components |
| Roland Heer | Postrendering-Effects |
| Henry Czösz | Un- / Redo |
