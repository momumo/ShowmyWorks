
# 3D Portfolio Web Application Blueprint

## 1. Overview

This document outlines the plan for creating a professional, interactive 3D portfolio website. The application will allow a user to showcase their 3D models and animations with a rich set of viewing options. The project will be built using modern web standards (HTML, CSS, JavaScript) and will leverage the Three.js library for all 3D rendering and interaction.

## 2. Project Outline & Features

### 2.1. Core Technologies
- **HTML:** For the main structure of the application.
- **CSS:** For modern styling, layout (including Flexbox/Grid), and a responsive design.
- **JavaScript (ES Modules):** For application logic and interactivity.
- **Three.js:** A high-level library for creating and displaying 3D graphics in the browser via WebGL.

### 2.2. File Structure
```
/
├── index.html         # Main entry point
├── style.css          # All styles for the application
├── main.js            # Main application logic, Three.js setup
├── /models/           # Directory for 3D model files (e.g., .glb, .gltf)
└── blueprint.md       # This file
```

### 2.3. Implemented Features & Design
- **Modern & Clean UI:**
    - A dark-themed, minimalist interface to ensure the 3D content is the main focus.
    - Responsive layout that works on both desktop and mobile devices.
    - Clear separation between the "Models" and "Animations" sections.
- **Navigation:**
    - A simple top navigation bar to switch between viewing sections.
- **3D Viewer:**
    - A centralized canvas where all 3D objects are rendered.
    - Mouse-based orbit controls (rotate, pan, zoom) for easy inspection of objects.
    - A floor plane that receives shadows for a more realistic presentation.
- **Sample Model:**
    - Loads an animated robot model (`.glb`) by default to demonstrate all features.

### 2.4. Feature: 3D Model Viewer
- **Model Loading:** Dynamically loads 3D models (currently a sample robot).
- **Control Panel:** A dedicated UI panel for model-specific options.
- **Shading Toggle:** A button to switch between the standard (shaded) material and a wireframe view.
- **Lighting Presets:** A dropdown to cycle through different lighting configurations ("Neutral," "Dramatic," "Spotlight").

### 2.5. Feature: 3D Animation Viewer
- **Animated Model Loading:** Loads models that contain embedded animation tracks.
- **Animation Selection:** A dropdown menu is automatically populated with all available animation clips from the loaded model.
- **Playback Controls:**
    - Play/Pause button.
    - Loop toggle button to control continuous playback.
    - A slider for scrubbing through the animation timeline frame by frame.

## 3. Development Plan

**Objective:** Build the core features of the 3D portfolio.

1.  **[COMPLETED]** Create this `blueprint.md` file to establish the project plan.
2.  **[COMPLETED]** Create the main `index.html` file, including the basic HTML structure, a canvas for the 3D viewer, and placeholder containers for UI controls.
3.  **[COMPLETED]** Import the Three.js library via a CDN link in the `index.html` file.
4.  **[COMPLETED]** Create the `style.css` file with initial styles for the layout, dark theme, and control panels.
5.  **[COMPLETED]** Create the `main.js` file and implement the initial Three.js setup (Scene, Camera, Renderer, Controls).
6.  **[COMPLETED]** Add a placeholder 3D object to verify the setup.
7.  **[COMPLETED]** Create a `models` directory.
8.  **[COMPLETED]** Update `main.js` to:
    - Load a sample animated GLB model (`RobotExpressive`).
    - Implement the full animation system (clip selection, play/pause, loop, timeline scrubbing).
    - Connect all UI controls to the corresponding functionalities.
    - Add a floor and shadows for better visualization.

## 4. Next Steps

- **Integrate User's Models:** Implement a file selection UI to allow the user to choose and load their own models from the `/models` directory.
- **Refine UI/UX:** Polish the interface, add loading indicators, and improve feedback to the user.
- **Deployment:** Prepare the application for deployment.
