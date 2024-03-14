import * as THREE from "three";
import CANNON from "cannon";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("canvas#canvas");

const sizes = {
  width: 1196,
  height: 590,
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
  alpha: true,
});

renderer.setClearColor("#F0F1FA");
renderer.setSize(sizes.width, sizes.height);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 20;
camera.lookAt(0, 0, 0);

/*
 GLTF Loader
 */
//  ./assets/models/Ball/
// gltfLoader.load(
//   "./assets/models/shape/shape.glb",

//   (gltf) => {
//     const ball = gltf.scene.children[0];
//     ball.castShadow = true;
//     ball.receiveShadow = true;

//     // Create a new material with blue color
//     const blueMaterial = new THREE.MeshStandardMaterial({
//       color: "blue",
//       specular: 0xffffff,
//       shininess: 500,
//     });

//     // Apply the blue material to the ball
//     ball.traverse((child) => {
//       if (child.isMesh) {
//         child.material = blueMaterial;
//       }
//     });

//     scene.add(ball);

//     const ballShape = new CANNON.Sphere(0.5);
//     const ballBody = new CANNON.Body({
//       mass: 12,
//       restitution: 0.1,
//       friction: 1,
//     });
//     ballBody.addShape(ballShape);
//     // Set the initial position of the ball's body
//     ballBody.position.set(0, 0, 0); // Assuming initial position is at (0, 0, 10)
//     world.addBody(ballBody);

//     // Function to update the ball's position and apply force towards the center
//     function updateBallPosition() {
//       // Get the direction vector towards the center
//       const direction = new CANNON.Vec3(
//         -ballBody.position.x,
//         -ballBody.position.y,
//         -ballBody.position.z
//       );
//       // Scale the direction vector to have a constant force
//       direction.normalize();
//       direction.scale(50, direction);

//       // Apply the force towards the center
//       ballBody.applyForce(direction, ballBody.position);

//       // Copy the position and quaternion to the Three.js object
//       ball.position.copy(ballBody.position);
//       ball.quaternion.copy(ballBody.quaternion);
//     }

//     // Animation loop
//     function animate() {
//       requestAnimationFrame(animate);
//       updateBallPosition();
//       renderer.render(scene, camera);
//       world.step(1 / 60);
//     }

//     // Start the animation loop
//     animate();
//   }
// );

// gltfLoader.load("./assets/models/shape/shape.glb", (gltf) => {
//   const originalModel = gltf.scene.children[0]; // Get the original model

//   for (let i = 0; i < 10; i++) {
//     const ball = originalModel.clone(); // Cloning the model
//     ball.castShadow = true;
//     ball.receiveShadow = true;

//     // Create a new material with blue color
//     const blueMaterial = new THREE.MeshStandardMaterial({
//       color: "blue",
//     });

//     // Apply the blue material to the ball

//     ball.traverse((child) => {
//       if (child.isMesh) {
//         child.material = blueMaterial;
//       }
//     });
//     // Adjust the position of each cloned model
//     ball.position.set(
//       Math.random() * 10 - 5,
//       Math.random() * 10 - 5,
//       Math.random() * 10 - 5
//     );

//     scene.add(ball);

//     const ballShape = new CANNON.Sphere(0.5);
//     const ballBody = new CANNON.Body({
//       mass: 2,
//       restitution: 0.5,
//       friction: 1,
//       angularDamping: 0.5,
//     });
//     ballBody.addShape(ballShape);
//     ballBody.position.set(ball.position.x, ball.position.y, ball.position.z);
//     ball.userData.body = ballBody; // Store the body reference in userData
//     world.addBody(ballBody);
//   }
// });

gltfLoader.load("./assets/models/shape/shape.glb", (gltf) => {
  const originalModel = gltf.scene.children[0]; // Get the original model

  const redMaterial = new THREE.MeshStandardMaterial({
    color: "red",
  });

  const yellowMaterial = new THREE.MeshStandardMaterial({
    color: "yellow",
  });

  const greenMaterial = new THREE.MeshStandardMaterial({
    color: "green",
  });

  const materials = [
    redMaterial,
    redMaterial,
    redMaterial,
    yellowMaterial,
    yellowMaterial,
    yellowMaterial,
    greenMaterial,
    greenMaterial,
    greenMaterial,
  ];

  for (let i = 0; i < 9; i++) {
    const ball = originalModel.clone(); // Cloning the model
    ball.castShadow = true;
    ball.receiveShadow = true;

    // Assign material based on the index
    ball.traverse((child) => {
      if (child.isMesh) {
        child.material = materials[i];
        const scale = 3;
        child.scale.set(scale, scale, scale);
      }
    });

    // Adjust the position of each cloned model
    ball.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    scene.add(ball);

    const ballShape = new CANNON.Sphere(2);
    const ballBody = new CANNON.Body({
      mass: 2,
      restitution: 0.5,
      friction: 1,
      angularDamping: 0.8,
    });
    ballBody.addShape(ballShape);
    ballBody.position.set(ball.position.x, ball.position.y, ball.position.z);
    ball.userData.body = ballBody; // Store the body reference in userData
    world.addBody(ballBody);
  }
});

function updateBallPosition() {
  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh && child.userData.body) {
      const direction = new CANNON.Vec3(
        -child.position.x,
        -child.position.y,
        -child.position.z
      );
      direction.normalize();
      direction.scale(30, direction);

      child.userData.body.applyForce(
        direction,
        new CANNON.Vec3(child.position.x, child.position.y, child.position.z)
      );

      child.position.copy(child.userData.body.position);
      child.quaternion.copy(child.userData.body.quaternion);
    }
  });
}

const attachedGeometry = new THREE.BoxGeometry();
const attachedMaterial = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0,
});
const attachedBox = new THREE.Mesh(attachedGeometry, attachedMaterial);
scene.add(attachedBox);

const attachedShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
const attachedBody = new CANNON.Body({
  mass: 0.5,
  restitution: 0.1,
  friction: 1,
});
attachedBody.addShape(attachedShape);
world.addBody(attachedBody);

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

function updateBoxPosition(e) {
  if (isCursorInsideCanvas) {
    const vector = new THREE.Vector3(mouseX, mouseY, 0);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    attachedBox.position.copy(pos);
    attachedBody.position.copy(attachedBox.position);
  } else {
    attachedBox.position.set(2, 2, 2);
    attachedBody.position.copy(attachedBox.position);
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateBoxPosition();
  updateBallPosition();
  renderer.render(scene, camera);
  world.step(1 / 60);
}
animate();
