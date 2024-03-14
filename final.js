import * as THREE from "three";
import CANNON from "cannon";

const canvas = document.querySelector("canvas#canvas");

const sizes = {
  width: 1200,
  height: 500,
};

let isCursorInsideCanvas = false;

const scaleSize = 1.5;

canvas.addEventListener("mouseenter", () => {
  isCursorInsideCanvas = true;
});

canvas.addEventListener("mouseleave", () => {
  isCursorInsideCanvas = false;
});

canvas.width = sizes.width;
canvas.height = sizes.height;

const scene = new THREE.Scene();

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

const world = new CANNON.World();
world.gravity.set(0, 0, 0); // Set gravity to zero initially

const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(2, 4, 6);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 12;
camera.lookAt(0, 0, 0);

const attachedGeometry = new THREE.SphereGeometry(scaleSize, 32, 32);
const attachedMaterial = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0,
});
const attatchedMesh = new THREE.Mesh(attachedGeometry, attachedMaterial);
scene.add(attatchedMesh);

const attachedShape = new CANNON.Sphere(scaleSize);
const attachedBody = new CANNON.Body({
  mass: 1,
  restitution: 10,
  friction: 1,
});
attachedBody.addShape(attachedShape);
world.addBody(attachedBody);

// Create boundary walls
const boundaryMaterial = new CANNON.Material(); // Custom material for boundary

// Set restitution and friction for the boundary material
// boundaryMaterial.restitution = 0.8; // Adjust for increased bounce
// boundaryMaterial.friction = 0.1; // Adjust for reduced friction

// Left wall
const leftBoundaryShape = new CANNON.Box(new CANNON.Vec3(0.1, 1000, 1000));
const leftBoundaryBody = new CANNON.Body({
  mass: 0,
  material: boundaryMaterial,
});
leftBoundaryBody.addShape(leftBoundaryShape);
leftBoundaryBody.position.set(-100, 0, 0);
world.addBody(leftBoundaryBody);

// Right wall
const rightBoundaryShape = new CANNON.Box(new CANNON.Vec3(0.1, 100, 100));
const rightBoundaryBody = new CANNON.Body({
  mass: 0,
  material: boundaryMaterial,
});
rightBoundaryBody.addShape(rightBoundaryShape);
rightBoundaryBody.position.set(100, 0, 0);
world.addBody(rightBoundaryBody);

// Top wall
const topBoundaryShape = new CANNON.Box(new CANNON.Vec3(100, 0.1, 100));
const topBoundaryBody = new CANNON.Body({
  mass: 0,
  material: boundaryMaterial,
});
topBoundaryBody.addShape(topBoundaryShape);
topBoundaryBody.position.set(0, 50, 0);
world.addBody(topBoundaryBody);

// Bottom wall
const bottomBoundaryShape = new CANNON.Box(new CANNON.Vec3(100, 0.1, 100));
const bottomBoundaryBody = new CANNON.Body({
  mass: 0,
  material: boundaryMaterial,
});
bottomBoundaryBody.addShape(bottomBoundaryShape);
bottomBoundaryBody.position.set(0, -50, 0);
world.addBody(bottomBoundaryBody);

// Front wall
const frontBoundaryShape = new CANNON.Box(new CANNON.Vec3(100, 100, 0.1));
const frontBoundaryBody = new CANNON.Body({
  mass: 0,
  material: boundaryMaterial,
});
frontBoundaryBody.addShape(frontBoundaryShape);
frontBoundaryBody.position.set(0, 0, -3);
world.addBody(frontBoundaryBody);

// Back wall
const backBoundaryShape = new CANNON.Box(new CANNON.Vec3(100, 100, 0.1));
const backBoundaryBody = new CANNON.Body({
  mass: 0,
  material: boundaryMaterial,
});
backBoundaryBody.addShape(backBoundaryShape);
backBoundaryBody.position.set(0, 0, 3);
world.addBody(backBoundaryBody);

// Collision between boxes and boundary
const boundaryContactMaterial = new CANNON.ContactMaterial(
  boundaryMaterial,
  boundaryMaterial,
  {
    friction: 0.1,
    restitution: 10, // Adjust for bounce
  }
);
world.addContactMaterial(boundaryContactMaterial);

//! Random Balls
const ballAmount = 12;
const ballsPerColor = 4;
const randomMeshes = [];
const randomBodies = [];

const redMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  roughness: 0.5,
  reflectivity: 0.5,
  metalness: 0.5,
});
const blueMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0000ff,
  roughness: 0.5,
  reflectivity: 0.5,
  metalness: 0.5,
});
const yellowMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffff00,
  roughness: 0.5,
  reflectivity: 0.5,
  metalness: 0.5,
});

const materials = [redMaterial, blueMaterial, yellowMaterial];

for (let colorIndex = 0; colorIndex < materials.length; colorIndex++) {
  const shinyMaterial = materials[colorIndex];

  const dullMaterial = shinyMaterial.clone();
  dullMaterial.roughness = 1;
  dullMaterial.reflectivity = 0;

  const normalMaterial = shinyMaterial.clone();
  normalMaterial.roughness = 0.2;
  normalMaterial.reflectivity = 0.8;

  const veryShinyMaterial = shinyMaterial.clone();
  veryShinyMaterial.roughness = 0;
  veryShinyMaterial.reflectivity = 1;

  const materialsArray = [
    shinyMaterial,
    dullMaterial,
    normalMaterial,
    veryShinyMaterial,
  ];

  for (let i = 0; i < ballsPerColor; i++) {
    const randomMaterial = materialsArray[i];
    const randomGeometry = new THREE.SphereGeometry(1, 32, 32);
    const randomMesh = new THREE.Mesh(randomGeometry, randomMaterial);

    randomMesh.scale.set(scaleSize, scaleSize, scaleSize);

    randomMesh.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      //   Math.random() * 10 - 5
      0
    );
    scene.add(randomMesh);
    randomMeshes.push(randomMesh);

    const shape = new CANNON.Sphere(scaleSize);
    const body = new CANNON.Body({ mass: 1, restitution: 10, friction: 1 });
    body.addShape(shape);
    body.position.copy(randomMesh.position);
    world.addBody(body);
    randomBodies.push(body);
  }
}

let mouseX = 0,
  mouseY = 0;

function onMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;
  mouseX = Math.min(Math.max(x, -1), 1);
  mouseY = Math.min(Math.max(y, -1), 1);
}

document.addEventListener("mousemove", onMouseMove, false);

function updateMeshPosition(e) {
  if (isCursorInsideCanvas) {
    const vector = new THREE.Vector3(mouseX, mouseY, 0);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    attatchedMesh.position.copy(pos);
    attachedBody.position.copy(attatchedMesh.position);
  } else {
    attatchedMesh.position.set(2, 2, 2);
    attachedBody.position.copy(attatchedMesh.position);
  }

  for (let i = 0; i < randomBodies.length; i++) {
    const gravityDirection = new CANNON.Vec3(
      -randomBodies[i].position.x,
      -randomBodies[i].position.y,
      -randomBodies[i].position.z
    ).unit();
    randomBodies[i].applyForce(
      gravityDirection.scale(60),
      randomBodies[i].position
    );
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateMeshPosition();
  renderer.render(scene, camera);
  world.step(1 / 60);
  for (let i = 0; i < randomMeshes.length; i++) {
    randomMeshes[i].position.copy(randomBodies[i].position);
    randomMeshes[i].quaternion.copy(randomBodies[i].quaternion);
  }
}
animate();
