// Declare variables
var scene, camera, renderer, clock, mixer, actions = [], mode;

init();

function init() {
  const assetPath = './'; // Path to assets
  
  clock = new THREE.Clock();
  
  // Create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00aaff);
  
  // Set up the camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-5, 25, 20);
  
  // Add lighting
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 2);
  light.position.set(0, 10, 2);
  scene.add(light);
  
  // Set up the renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Add OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(1, 2, 0);
  controls.update();
  
  // Button to control animations
  mode = 'open';
  const btn = document.getElementById("btn");
  btn.addEventListener('click', function() {
    if (actions.length === 2) {
      if (mode === "open") {
        actions.forEach(action => {
          action.timeScale = 1;
          action.reset();
          action.play();
        });
      }
    }
  });
  
  // Load the glTF model
  const loader = new THREE.GLTFLoader();
  loader.load(assetPath + 'can_template_animation_tab.glb', function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    
    // Set up animations
    mixer = new THREE.AnimationMixer(model);
    const animations = gltf.animations; // Array of animation clips

    animations.forEach(clip => {
      const action = mixer.clipAction(clip);
      actions.push(action);
    });

  });
  
  // Handle resizing
  window.addEventListener('resize', resize, false);
  
  // Start the animation loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Update animations
  if (mixer) {
    mixer.update(clock.getDelta());
  }

  renderer.render(scene, camera);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
