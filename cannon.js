// Import Three.js library
import * as THREE from "three";
import CANNON, { ContactMaterial } from "cannon";

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create cylinder geometry
const radius = 1;
const height = 2;
const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 16);

// Create THREE.js meshes for cylinders
const cylinderMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cylinderMaterial2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cylinderMaterial3 = new THREE.MeshStandardMaterial({ color: 0x0000ff });

const cylinderMesh1 = new THREE.Mesh(cylinderGeometry, cylinderMaterial1);
const cylinderMesh2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial2);
const cylinderMesh3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial3);

// Position and orient cylinders
const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);

const position1 = new THREE.Vector3(0, 0, 0);
const position2 = new THREE.Vector3(0, 3, 0);
const position3 = new THREE.Vector3(0, -3, 0);

cylinderMesh1.position.copy(position1);
cylinderMesh1.quaternion.copy(quaternion);
cylinderMesh2.position.copy(position2);
cylinderMesh2.quaternion.copy(quaternion);
cylinderMesh3.position.copy(position3);
cylinderMesh3.quaternion.copy(quaternion);

// Add cylinders to the scene
scene.add(cylinderMesh1);
scene.add(cylinderMesh2);
scene.add(cylinderMesh3);

// Set camera position and look at origin
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Add event listener for window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to animate the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Start animation
animate();
