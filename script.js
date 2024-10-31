const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const bgParticleCount = 10000;
const bgPositions = new Float32Array(bgParticleCount * 3);
const bgPositionsOpposite = new Float32Array(bgParticleCount * 3);
let bgParticles;
let bgParticlesOpposite;

function createBackgroundParticles() {
    const bgGeometry = new THREE.BufferGeometry();

    for (let i = 0; i < bgParticleCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(10);
        const y = THREE.MathUtils.randFloatSpread(1000);
        const z = THREE.MathUtils.randFloatSpread(3000);

        bgPositions.set([x, y, z], i * 3);
        bgPositionsOpposite.set([-x, -y, -z], i * 3);
    }

    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    const bgMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.10 });
    bgParticles = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgParticles);

    const bgGeometryOpposite = new THREE.BufferGeometry();
    bgGeometryOpposite.setAttribute('position', new THREE.BufferAttribute(bgPositionsOpposite, 3));
    bgParticlesOpposite = new THREE.Points(bgGeometryOpposite, bgMaterial);
    bgParticlesOpposite.renderOrder = 1;
    scene.add(bgParticlesOpposite);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

function animate() {
    const time = Date.now() * 0.001;

    for (let i = 0; i < bgParticleCount; i++) {
        const direction = Math.sin(time + i);
        const distance = 200;

        bgPositions[i * 3 + 0] = direction * distance;
        bgPositions[i * 2 + 2] = Math.cos(time + i) * 200;
        bgPositions[i * 3 + 2] = Math.tan(time + i) * 90;
        bgPositionsOpposite[i * 3 + 1] = Math.sin(time + i) * 100;
        bgPositionsOpposite[i * 3 + 3] = Math.cos(time + i) * 200;
    }

    bgParticles.geometry.attributes.position.needsUpdate = true;
    bgParticlesOpposite.geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

camera.position.set(2, 0, 5);
createBackgroundParticles();
animate();
