// import * as THREE from "three";
// import CANNON, { ContactMaterial } from "cannon";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// const canvas = document.querySelector("canvas#canvas");

// const sizes = {
//   width: 700,
//   height: 500,
// };

// let isCursorInsideCanvas = false;

// canvas.addEventListener("mouseenter", () => {
//   isCursorInsideCanvas = true;
// });

// canvas.addEventListener("mouseleave", () => {
//   isCursorInsideCanvas = false;
// });

// canvas.width = sizes.width;
// canvas.height = sizes.height;

// const scene = new THREE.Scene();

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

// const gltfLoader = new GLTFLoader();

// const world = new CANNON.World();
// world.gravity.set(0, 0, 0); // Set gravity to zero initially

// const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.bottom = -7;
// directionalLight.position.set(5, 5, 5);
// scene.add(directionalLight);

// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
// });
// renderer.setSize(sizes.width, sizes.height);

// camera.position.x = 0;
// camera.position.y = 0;
// camera.position.z = 10;
// camera.lookAt(0, 0, 0);

// const attachedGeometry = new THREE.SphereGeometry(1, 32, 32);
// const attachedMaterial = new THREE.MeshLambertMaterial({
//   color: 0x00ff00,
//   // transparent: true,
//   // opacity: 0,
// });
// const attatchedMesh = new THREE.Mesh(attachedGeometry, attachedMaterial);
// scene.add(attatchedMesh);

// const attachedShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
// const attachedBody = new CANNON.Body({ mass: 1, restitution: 2, friction: 1 });
// attachedBody.addShape(attachedShape);
// world.addBody(attachedBody);

// //! Random Boxes
// const meshAmount = 12;
// const randomMeshes = [];
// const randomMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
// const randomBodies = [];

// const redMaterial = new THREE.MeshPhongMaterial({
//   color: 0xff0000,
//   shininess: 100,
// });
// const blueMaterial = new THREE.MeshPhongMaterial({
//   color: 0x0000ff,
//   shininess: 100,
// });
// const yellowMaterial = new THREE.MeshPhongMaterial({
//   color: 0xffff00,
//   shininess: 100,
// });

// const materials = [redMaterial, blueMaterial, yellowMaterial];

// for (let i = 0; i < meshAmount; i++) {
//   const randomGeometry = new THREE.SphereGeometry(1, 32, 32);
//   // const randomMesh = new THREE.Mesh(randomGeometry, randomMaterial);

//   const materialIndex = Math.floor(i / (meshAmount / materials.length)); // Distribute colors evenly

//   let material = materials[materialIndex];

//   // const material = materials[Math.floor(i / (meshAmount / materials.length))]; // Distribute colors evenly

//   if (i === materialIndex) {
//     material = new THREE.MeshPhongMaterial({
//       color: material.color,
//       shininess: 1,
//     });
//   }

//   console.log(i);
//   const randomMesh = new THREE.Mesh(randomGeometry, material);

//   randomMesh.position.set(
//     Math.random() * 10 - 5,
//     Math.random() * 10 - 5,
//     Math.random() * 10 - 5
//   );
//   scene.add(randomMesh);
//   randomMeshes.push(randomMesh);

//   // const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
//   const shape = new CANNON.Sphere(1);
//   const body = new CANNON.Body({ mass: 1, restitutio32n32: 2, friction: 1 });
//   body.addShape(shape);
//   body.position.copy(randomMesh.position);
//   world.addBody(body);
//   randomBodies.push(body);
// }

// let mouseX = 0,
//   mouseY = 0;

// function onMouseMove(event) {
//   const rect = canvas.getBoundingClientRect();
//   const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
//   const y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;
//   mouseX = Math.min(Math.max(x, -1), 1);
//   mouseY = Math.min(Math.max(y, -1), 1);
// }

// document.addEventListener("mousemove", onMouseMove, false);

// function updateMeshPosition(e) {
//   // Check if the cursor is inside the canvas

//   if (isCursorInsideCanvas) {
//     const vector = new THREE.Vector3(mouseX, mouseY, 0);
//     vector.unproject(camera);
//     const dir = vector.sub(camera.position).normalize();
//     const distance = -camera.position.z / dir.z;
//     const pos = camera.position.clone().add(dir.multiplyScalar(distance));
//     attatchedMesh.position.copy(pos);
//     attachedBody.position.copy(attatchedMesh.position);
//   } else {
//     // Set the position of the attatchedMesh to (2, 2, 2) in the scene
//     attatchedMesh.position.set(2, 2, 2);
//     attachedBody.position.copy(attatchedMesh.position);
//   }

//   // Apply gravity to objects except attached box
//   for (let i = 0; i < randomBodies.length; i++) {
//     const gravityDirection = new CANNON.Vec3(
//       -randomBodies[i].position.x,
//       -randomBodies[i].position.y,
//       -randomBodies[i].position.z
//     ).unit();
//     randomBodies[i].applyForce(
//       gravityDirection.scale(20),
//       randomBodies[i].position
//     );
//   }
// }

// function animate() {
//   requestAnimationFrame(animate);
//   updateMeshPosition();
//   renderer.render(scene, camera);
//   world.step(1 / 60);
//   for (let i = 0; i < randomMeshes.length; i++) {
//     randomMeshes[i].position.copy(randomBodies[i].position);
//     randomMeshes[i].quaternion.copy(randomBodies[i].quaternion);
//   }
// }
// animate();

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

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
camera.lookAt(0, 0, 0);

const attachedGeometry = new THREE.SphereGeometry(1, 32, 32);
const attachedMaterial = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  // transparent: true,
  // opacity: 0,
});
const attatchedMesh = new THREE.Mesh(attachedGeometry, attachedMaterial);
scene.add(attatchedMesh);

const attachedShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const attachedBody = new CANNON.Body({ mass: 1, restitution: 2, friction: 1 });
attachedBody.addShape(attachedShape);
world.addBody(attachedBody);

//! Random Boxes
const meshAmount = 12;
const randomMeshes = [];
const randomMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const randomBodies = [];

const redMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  shininess: 100,
});
const blueMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  shininess: 100,
});
const yellowMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  shininess: 100,
});

const materials = [redMaterial, blueMaterial, yellowMaterial];

for (let i = 0; i < meshAmount; i++) {
  const randomGeometry = new THREE.SphereGeometry(1, 32, 32);
  // const randomMesh = new THREE.Mesh(randomGeometry, randomMaterial);

  const materialIndex = Math.floor(i / (meshAmount / materials.length)); // Distribute colors evenly

  let material = materials[materialIndex];

  // const material = materials[Math.floor(i / (meshAmount / materials.length))]; // Distribute colors evenly

  if (i === materialIndex) {
    material = new THREE.MeshPhongMaterial({
      color: material.color,
      shininess: 1,
    });
  }

  console.log(i);
  const randomMesh = new THREE.Mesh(randomGeometry, material);

  randomMesh.position.set(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
  scene.add(randomMesh);
  randomMeshes.push(randomMesh);

  // const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const shape = new CANNON.Sphere(1);
  const body = new CANNON.Body({ mass: 1, restitutio32n32: 2, friction: 1 });
  body.addShape(shape);
  body.position.copy(randomMesh.position);
  world.addBody(body);
  randomBodies.push(body);
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
  // Check if the cursor is inside the canvas

  if (isCursorInsideCanvas) {
    const vector = new THREE.Vector3(mouseX, mouseY, 0);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    attatchedMesh.position.copy(pos);
    attachedBody.position.copy(attatchedMesh.position);
  } else {
    // Set the position of the attatchedMesh to (2, 2, 2) in the scene
    attatchedMesh.position.set(2, 2, 2);
    attachedBody.position.copy(attatchedMesh.position);
  }

  // Apply gravity to objects except attached box
  for (let i = 0; i < randomBodies.length; i++) {
    const gravityDirection = new CANNON.Vec3(
      -randomBodies[i].position.x,
      -randomBodies[i].position.y,
      -randomBodies[i].position.z
    ).unit();
    randomBodies[i].applyForce(
      gravityDirection.scale(20),
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
