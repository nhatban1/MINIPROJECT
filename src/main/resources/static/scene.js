import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const dialog = document.querySelector("#product3dDialog");
const stage = document.querySelector("#productScene");
const formatMoney = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
let renderer;
let scene;
let camera;
let controls;
let productGroup;
let resizeObserver;
let animationFrame;

const material = (color, metalness = 0.35, roughness = 0.4) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
const dark = material(0x20282a, 0.5, 0.36);
const board = material(0x31534b, 0.2, 0.7);
const aluminum = material(0xb8c3c3, 0.72, 0.26);
const gold = material(0xc69b53, 0.74, 0.28);
const accent = material(0x73a49b, 0.48, 0.3);
const glass = new THREE.MeshPhysicalMaterial({ color: 0x78918f, metalness: 0.24, roughness: 0.2, transparent: true, opacity: 0.52 });

function box(group, size, position, appearance = dark, bevel = 0) {
  const geometry = bevel
    ? new THREE.BoxGeometry(...size, 3, 3, 3)
    : new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, appearance);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function cylinder(group, radius, depth, position, appearance = dark, segments = 48) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, segments), appearance);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function ring(group, radius, tube, position, appearance = accent) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 48), appearance);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function buildCpu(group) {
  box(group, [1.52, 1.52, 0.22], [0, 0, 0], aluminum, 2);
  box(group, [1.16, 1.16, 0.08], [0, 0, 0.15], dark);
  box(group, [0.86, 0.86, 0.025], [0, 0, 0.205], gold);
  box(group, [0.68, 0.68, 0.035], [0, 0, 0.23], material(0x5b6969, 0.72, 0.22));
  for (let index = -4; index <= 4; index += 1) {
    box(group, [0.035, 0.08, 0.025], [index * 0.14, 0.78, 0], gold);
    box(group, [0.035, 0.08, 0.025], [index * 0.14, -0.78, 0], gold);
    box(group, [0.08, 0.035, 0.025], [0.78, index * 0.14, 0], gold);
    box(group, [0.08, 0.035, 0.025], [-0.78, index * 0.14, 0], gold);
  }
}

function buildBoard(group) {
  box(group, [2.4, 1.8, 0.1], [0, 0, 0], board);
  box(group, [0.78, 0.78, 0.1], [-0.54, 0.3, 0.1], dark);
  box(group, [0.54, 0.54, 0.08], [-0.54, 0.3, 0.18], aluminum);
  for (let index = 0; index < 4; index += 1) {
    box(group, [0.12, 0.76, 0.08], [0.22 + index * 0.2, 0.32, 0.14], dark);
  }
  for (let index = 0; index < 5; index += 1) {
    box(group, [1.3, 0.045, 0.06], [0.25, -0.56 + index * 0.17, 0.1], index === 2 ? gold : aluminum);
  }
  for (let index = 0; index < 6; index += 1) {
    box(group, [0.12, 0.14, 0.08], [-0.98 + (index % 3) * 0.2, -0.5 + Math.floor(index / 3) * 0.34, 0.11], dark);
  }
}

function buildGraphicsCard(group) {
  box(group, [2.35, 0.76, 0.52], [0, 0, 0], dark);
  box(group, [2.2, 0.57, 0.08], [0, 0, 0.29], material(0x35413f, 0.65, 0.28));
  for (const x of [-0.56, 0.56]) {
    cylinder(group, 0.27, 0.055, [x, 0, 0.37], aluminum);
    cylinder(group, 0.21, 0.07, [x, 0, 0.42], dark);
    ring(group, 0.25, 0.025, [x, 0, 0.42], accent);
    cylinder(group, 0.055, 0.09, [x, 0, 0.47], gold, 24);
  }
  box(group, [1.72, 0.07, 0.1], [0, -0.39, 0], gold);
  box(group, [0.13, 0.32, 0.48], [1.18, 0.02, 0], aluminum);
}

function buildMemory(group, category) {
  const isDrive = category.includes("SSD");
  const length = isDrive ? 1.72 : 2.05;
  box(group, [length, 0.42, 0.1], [0, 0, 0], board);
  for (let index = 0; index < (isDrive ? 4 : 6); index += 1) {
    box(group, [0.22, 0.23, 0.07], [-0.62 + index * 0.25, 0, 0.08], dark);
  }
  box(group, [length * 0.72, 0.035, 0.03], [0, -0.2, -0.02], gold);
  box(group, [0.16, 0.2, 0.08], [length / 2 + 0.02, 0, 0], gold);
}

function buildMonitor(group) {
  box(group, [2.16, 1.28, 0.13], [0, 0.2, 0], dark);
  box(group, [1.96, 1.08, 0.025], [0, 0.2, 0.08], accent);
  box(group, [0.16, 0.5, 0.13], [0, -0.62, 0], aluminum);
  box(group, [0.86, 0.1, 0.52], [0, -0.89, 0], dark);
}

function buildKeyboard(group) {
  box(group, [2.26, 0.82, 0.14], [0, 0, 0], dark);
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 13; column += 1) {
      const key = box(group, [0.12, 0.1, 0.07], [-0.98 + column * 0.16, 0.3 - row * 0.15, 0.1], row === 0 && column === 0 ? accent : aluminum);
      key.scale.z = 0.8;
    }
  }
}

function buildPowerSupply(group) {
  box(group, [1.65, 0.86, 0.72], [0, 0, 0], dark);
  cylinder(group, 0.29, 0.06, [0, 0, 0.39], aluminum);
  cylinder(group, 0.24, 0.07, [0, 0, 0.43], dark);
  ring(group, 0.27, 0.018, [0, 0, 0.44], accent);
  box(group, [0.27, 0.56, 0.08], [0.54, 0, 0.4], gold);
}

function buildCase(group) {
  box(group, [1.35, 2.1, 0.12], [0, 0, -0.48], dark);
  box(group, [1.35, 2.1, 0.1], [0, 0, 0.48], glass);
  box(group, [0.12, 2.1, 0.94], [-0.67, 0, 0], dark);
  box(group, [0.12, 2.1, 0.94], [0.67, 0, 0], dark);
  box(group, [1.3, 0.12, 0.94], [0, 1.04, 0], dark);
  box(group, [1.3, 0.12, 0.94], [0, -1.04, 0], dark);
  for (const y of [-0.57, 0.38]) {
    cylinder(group, 0.29, 0.07, [0.22, y, 0.59], aluminum);
    ring(group, 0.26, 0.028, [0.22, y, 0.64], accent);
    cylinder(group, 0.04, 0.09, [0.22, y, 0.65], dark, 24);
  }
  box(group, [0.34, 1.24, 0.08], [-0.32, 0.05, 0.2], board);
}

function createModel(product) {
  const group = new THREE.Group();
  const category = (product.category || "").toLowerCase();
  if (category === "cpu") buildCpu(group);
  else if (category.includes("mainboard")) buildBoard(group);
  else if (category === "vga") buildGraphicsCard(group);
  else if (category === "ram" || category === "ssd") buildMemory(group, category);
  else if (category === "màn hình") buildMonitor(group);
  else if (category === "bàn phím") buildKeyboard(group);
  else if (category === "psu") buildPowerSupply(group);
  else buildCase(group);
  return group;
}

function setup() {
  if (renderer) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe9eeeb);
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(3.8, 2.7, 5.5);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.domElement.setAttribute("aria-label", "Mô hình sản phẩm ba chiều");
  stage.replaceChildren(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xf4f7f5, 0x52635e, 2.1));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
  keyLight.position.set(3.8, 5, 4);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x9dbab5, 1.7);
  fillLight.position.set(-4, 1, -3);
  scene.add(fillLight);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), material(0xd9e0dc, 0, 0.9));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.36;
  floor.receiveShadow = true;
  scene.add(floor);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;
  controls.minDistance = 3;
  controls.maxDistance = 9;
  controls.maxPolarAngle = Math.PI * 0.82;
  controls.target.set(0, 0, 0);
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();
  renderFrame();
}

function resize() {
  if (!renderer || !camera) return;
  const bounds = stage.getBoundingClientRect();
  const width = Math.max(1, bounds.width);
  const height = Math.max(1, bounds.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function renderFrame() {
  animationFrame = requestAnimationFrame(renderFrame);
  if (controls) controls.update();
  renderer.render(scene, camera);
}

window.showProductPreview = (product) => {
  document.querySelector("#sceneProductName").textContent = product.name;
  document.querySelector("#sceneProductSpecs").textContent = product.specs || product.category;
  document.querySelector("#sceneProductPrice").textContent = formatMoney(product.price);
  if (!dialog.open) dialog.showModal();
  setup();
  if (productGroup) {
    scene.remove(productGroup);
    productGroup.traverse((object) => {
      object.geometry?.dispose();
    });
  }
  productGroup = createModel(product);
  productGroup.rotation.y = -0.35;
  scene.add(productGroup);
  controls?.reset();
  resize();
};

document.querySelector("#sceneClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  if (controls) controls.autoRotate = true;
});
window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  controls?.dispose();
  renderer?.dispose();
});
