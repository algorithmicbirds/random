// Create canvas and set up scene
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: false }); // Enable alpha for a transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const bgParticleCount = 10000; // Reduce the number of particles for mobile
const bgPositions = new Float32Array(bgParticleCount * 3);
const bgPositionsOpposite = new Float32Array(bgParticleCount * 3); // New array for opposite positions
let bgParticles; // Declare bgParticles in the wider scope
let bgParticlesOpposite; // Declare bgParticlesOpposite

// Create background particles
function createBackgroundParticles() {
    const bgGeometry = new THREE.BufferGeometry();

    // Fill bgPositions with random initial values
    for (let i = 0; i < bgParticleCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(10); // x
        const y = THREE.MathUtils.randFloatSpread(1000); // y
        const z = THREE.MathUtils.randFloatSpread(3000); // z

        bgPositions.set([x, y, z], i * 3);
        bgPositionsOpposite.set([-x, -y, -z], i * 3); // Set opposite positions
    }

    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    const bgMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.10 });
    bgParticles = new THREE.Points(bgGeometry, bgMaterial); // Initialize bgParticles
    scene.add(bgParticles); // Add first to scene

    // Create second set of particles with opposite positions
    const bgGeometryOpposite = new THREE.BufferGeometry();
    bgGeometryOpposite.setAttribute('position', new THREE.BufferAttribute(bgPositionsOpposite, 3));
    bgParticlesOpposite = new THREE.Points(bgGeometryOpposite, bgMaterial); // Initialize bgParticlesOpposite
    bgParticlesOpposite.renderOrder = 1; // Set render order to ensure this is drawn on top
    scene.add(bgParticlesOpposite); // Add second to scene
}

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light for overall illumination
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Stronger light source
directionalLight.position.set(5, 10, 7.5); // Position the light
directionalLight.castShadow = true; // Enable shadows for the directional light
scene.add(directionalLight);

// Animate background particles smoothly
function animate() {
    // Update background particle positions for smoother animation
    const time = Date.now() * 0.001; // Use time in seconds, slower time scale for mobile

    for (let i = 0; i < bgParticleCount; i++) {
        const direction = Math.sin(time + i); // Use sine for back and forth motion
        const distance = 200; // Adjust this value for the distance of movement

        bgPositions[i * 3 + 0] = direction * distance; // x position moves left and right
        bgPositions[i * 2 + 2] = Math.cos(time + i) * 200; // y position remains based on cosine
        bgPositions[i * 3 + 2] = Math.tan(time + i) * 90; // z position remains based on tangent
        // Update opposite background particles
        bgPositionsOpposite[i * 3 + 1] = Math.sin(time + i) * 100; // Inverse height movement
        bgPositionsOpposite[i * 3 + 3] = Math.cos(time + i) * 200; // Inverse depth movement
    }

    bgParticles.geometry.attributes.position.needsUpdate = true; // Update background particle positions
    bgParticlesOpposite.geometry.attributes.position.needsUpdate = true; // Update opposite background particle positions

    // Render the scene
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Initial camera position
camera.position.set(2, 0, 5); // Set the camera position further back for better view

// Create background particles
createBackgroundParticles();

// Start the animation loop
animate();
