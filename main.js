import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- DOM Elements ---
const canvas = document.querySelector('#c');
const viewerContainer = document.querySelector('#viewer-container');
const modelsBtn = document.getElementById('models-btn');
const animationsBtn = document.getElementById('animations-btn');
const modelControls = document.getElementById('model-controls');
const animationControls = document.getElementById('animation-controls');
const shadingBtn = document.getElementById('shading-btn');
const wireframeBtn = document.getElementById('wireframe-btn');
const lightingSelect = document.getElementById('lighting-select');
const animationSelect = document.getElementById('animation-select');
const playPauseBtn = document.getElementById('play-pause-btn');
const loopCheckbox = document.getElementById('loop-checkbox');
const timelineSlider = document.getElementById('timeline-slider');


// --- THREE.js Global Variables ---
let scene, camera, renderer, controls, clock;
let model, mixer, actions = {}, activeAction;

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
const spotLight = new THREE.SpotLight(0xffffff, 10, 30, Math.PI / 4, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
spotLight.castShadow = true;

// --- Main Initialization ---
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    clock = new THREE.Clock();

    // Camera
    camera = new THREE.PerspectiveCamera(75, viewerContainer.clientWidth / viewerContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 4);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    // Initial Lighting
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
        'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
        (gltf) => {
            model = gltf.scene;
            model.scale.set(0.8, 0.8, 0.8);
            model.position.y = 0;
            scene.add(model);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Setup animations
            setupAnimations(gltf.animations);
            
            // Update spotlight to target the loaded model
            spotLight.target = model;

            // Initial shading/wireframe state
            const isWireframe = wireframeBtn.classList.contains('active');
            setWireframe(isWireframe);
        },
        undefined, // onProgress callback not used
        (error) => {
            console.error('An error happened while loading the model:', error);
        }
    );
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Start render loop
    animate();
}

// --- Animation Setup ---
function setupAnimations(animations) {
    mixer = new THREE.AnimationMixer(model);
    animationSelect.innerHTML = ''; // Clear placeholder options

    if (animations && animations.length) {
        animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            actions[clip.name] = action;

            // Create option in dropdown
            const option = document.createElement('option');
            option.value = clip.name;
            option.innerText = clip.name;
            animationSelect.appendChild(option);
        });
        // Activate the first animation by default
        setActiveAction(animations[0].name);
    } else {
        animationControls.style.display = 'none'; // Hide animation controls if no clips
    }
}

function setActiveAction(name) {
    if (activeAction) {
        activeAction.fadeOut(0.5);
    }
    activeAction = actions[name];
    if (activeAction) {
        activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(0.5)
            .play();
        updateTimeline();
    }
}

// --- Render Loop ---
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (mixer) {
        mixer.update(delta);
        updateTimeline();
    }

    controls.update();
    renderer.render(scene, camera);
}

// --- UI Event Handlers ---
function setupUI() {
    // Main Navigation
    modelsBtn.addEventListener('click', () => {
        modelsBtn.classList.add('active');
        animationsBtn.classList.remove('active');
        modelControls.classList.add('active');
        animationControls.classList.remove('active');
    });

    animationsBtn.addEventListener('click', () => {
        animationsBtn.classList.add('active');
        modelsBtn.classList.remove('active');
        animationControls.classList.add('active');
        modelControls.classList.remove('active');
    });

    // Model Controls
    shadingBtn.addEventListener('click', () => setWireframe(false));
    wireframeBtn.addEventListener('click', () => setWireframe(true));

    lightingSelect.addEventListener('change', (event) => {
        scene.remove(ambientLight, directionalLight, spotLight);
        const selection = event.target.value;
        switch (selection) {
            case 'neutral':
                scene.add(ambientLight); scene.add(directionalLight); break;
            case 'dramatic':
                scene.add(new THREE.AmbientLight(0xffffff, 0.2)); scene.add(directionalLight); break;
            case 'spotlight':
                scene.add(new THREE.AmbientLight(0xffffff, 0.3)); scene.add(spotLight); break;
        }
    });

    // Animation Controls
    animationSelect.addEventListener('change', (e) => setActiveAction(e.target.value));
    
    playPauseBtn.addEventListener('click', () => {
        if (!activeAction) return;
        if (activeAction.isRunning()) {
            activeAction.paused = true;
            playPauseBtn.textContent = 'Play';
        } else {
            activeAction.paused = false;
            playPauseBtn.textContent = 'Pause';
        }
    });

    loopCheckbox.addEventListener('change', (e) => {
        if (!activeAction) return;
        activeAction.setLoop(e.target.checked ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    });

    timelineSlider.addEventListener('input', (e) => {
        if (mixer && activeAction) {
            const time = (e.target.value / 100) * activeAction.getClip().duration;
            mixer.setTime(time);
        }
    });
}

function setWireframe(isWireframe) {
    if (isWireframe) {
        wireframeBtn.classList.add('active');
        shadingBtn.classList.remove('active');
    } else {
        shadingBtn.classList.add('active');
        wireframeBtn.classList.remove('active');
    }
    if (model) {
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.wireframe = isWireframe;
            }
        });
    }
}

function updateTimeline() {
    if (activeAction) {
        const duration = activeAction.getClip().duration;
        const time = activeAction.time;
        timelineSlider.value = (time / duration) * 100;
    }
}

// --- Resizing ---
function onWindowResize() {
    const width = viewerContainer.clientWidth;
    const height = viewerContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// --- Initialization ---
window.addEventListener('resize', onWindowResize);
init();
setupUI();
