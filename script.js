import * as THREE from "three";
import CANNON, { ContactMaterial } from "cannon";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const canvas = document.querySelector("canvas#canvas");

const sizes = {
  width: 700,
  height: 500,
};

let isCursorInsideCanvas = false;

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

const gltfLoader = new GLTFLoader();

const world = new CANNON.World();
world.gravity.set(0, 0, 0); // Set gravity to zero initially

const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
camera.lookAt(0, 0, 0);

/*
 GLTF Loader
 */
//  ./assets/models/Ball/
gltfLoader.load("./assets/models/shape/shape.glb", (gltf) => {
  const ball = gltf.scene.children[0];
  ball.castShadow = true;
  ball.receiveShadow = true;

  // Create a new material with blue color
  const blueMaterial = new THREE.MeshNormalMaterial({
    // color: "blue",
    // specular: 0xffffff,
    // shininess: 500,
  });

  // Apply the blue material to the ball
  ball.traverse((child) => {
    if (child.isMesh) {
      child.material = blueMaterial; 
      
    }
  });

  scene.add(ball);

  const ballShape = new CANNON.Sphere(0.5);
  const ballBody = new CANNON.Body({ mass: 1, restitution: 2, friction: 1 });
  ballBody.addShape(ballShape);
  // Set the initial position of the ball's body
  ballBody.position.set(0, 0, 10); // Assuming initial position is at (0, 0, 10)
  world.addBody(ballBody);

  // Function to update the ball's position and apply force towards the center
  function updateBallPosition() {
    // Get the direction vector towards the center
    const direction = new CANNON.Vec3(
      -ballBody.position.x,
      -ballBody.position.y,
      -ballBody.position.z
    );
    // Scale the direction vector to have a constant force
    direction.normalize();
    direction.scale(10, direction);

    // Apply the force towards the center
    ballBody.applyForce(direction, ballBody.position);

    // Copy the position and quaternion to the Three.js object
    ball.position.copy(ballBody.position);
    ball.quaternion.copy(ballBody.quaternion);
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updateBallPosition();
    renderer.render(scene, camera);
    world.step(1 / 60);
  }

  // Start the animation loop
  animate();
});

const attachedGeometry = new THREE.BoxGeometry();
const attachedMaterial = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0,
});
const attachedBox = new THREE.Mesh(attachedGeometry, attachedMaterial);
scene.add(attachedBox);

const attachedShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const attachedBody = new CANNON.Body({ mass: 1, restitution: 2, friction: 1 });
attachedBody.addShape(attachedShape);
world.addBody(attachedBody);

const numRandomBoxes = 10;
const randomBoxes = [];
const randomMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const randomBoxBodies = [];

for (let i = 0; i < numRandomBoxes; i++) {
  const randomGeometry = new THREE.BoxGeometry();
  const randomBox = new THREE.Mesh(randomGeometry, randomMaterial);
  randomBox.position.set(
    Math.random() * 12 - 6,
    Math.random() * 12 - 6,
    // Math.random() * 10 - 5
    Math.random() * 12 - 6
  );
  scene.add(randomBox);
  randomBoxes.push(randomBox);

  const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const body = new CANNON.Body({ mass: 1, restitution: 2, friction: 1 });
  body.addShape(shape);
  body.position.copy(randomBox.position);
  world.addBody(body);
  randomBoxBodies.push(body);
}

let mouseX = 0,
  mouseY = 0;

// function onMouseMove(event) {
//   mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//   mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

//   console.log("event.clientX ", event.clientX);
//   console.log("event.clientY ", event.clientY);
//   console.log("mouseX", mouseX);
//   console.log("mouseY", mouseY);
// }

function onMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;
  mouseX = Math.min(Math.max(x, -1), 1);
  mouseY = Math.min(Math.max(y, -1), 1);
}

document.addEventListener("mousemove", onMouseMove, false);

// function updateBoxPosition() {
//   const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
//   vector.unproject(camera);
//   const dir = vector.sub(camera.position).normalize();
//   const distance = -camera.position.z / dir.z;
//   const pos = camera.position.clone().add(dir.multiplyScalar(distance));
//   attachedBox.position.copy(pos);
//   attachedBody.position.copy(attachedBox.position);

//   // Apply gravity to objects except attached box
//   for (let i = 0; i < randomBoxBodies.length; i++) {
//     const gravityDirection = new CANNON.Vec3(
//       -randomBoxBodies[i].position.x,
//       -randomBoxBodies[i].position.y,
//       -randomBoxBodies[i].position.z
//     ).unit();
//     randomBoxBodies[i].applyForce(
//       gravityDirection.scale(20),
//       randomBoxBodies[i].position
//     );
//   }
// }

function updateBoxPosition(e) {
  // Check if the cursor is inside the canvas

  if (isCursorInsideCanvas) {
    const vector = new THREE.Vector3(mouseX, mouseY, 0);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    attachedBox.position.copy(pos);
    attachedBody.position.copy(attachedBox.position);
  } else {
    // Set the position of the attachedBox to (2, 2, 2) in the scene
    attachedBox.position.set(2, 2, 2);
    attachedBody.position.copy(attachedBox.position);
  }

  // Apply gravity to objects except attached box
  for (let i = 0; i < randomBoxBodies.length; i++) {
    const gravityDirection = new CANNON.Vec3(
      -randomBoxBodies[i].position.x,
      -randomBoxBodies[i].position.y,
      -randomBoxBodies[i].position.z
    ).unit();
    randomBoxBodies[i].applyForce(
      gravityDirection.scale(20),
      randomBoxBodies[i].position
    );
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateBoxPosition();
  renderer.render(scene, camera);
  world.step(1 / 60);
  for (let i = 0; i < randomBoxes.length; i++) {
    randomBoxes[i].position.copy(randomBoxBodies[i].position);
    randomBoxes[i].quaternion.copy(randomBoxBodies[i].quaternion);
  }
}
animate();
