import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Product } from "../types";

interface TestPreviewProps {
  product: Product;
}

export default function Product3DPreview({ product }: TestPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [meshStyle, setMeshStyle] = useState<"solid" | "wireframe">("solid");
  const [spinSpeed, setSpinSpeed] = useState<number>(0.008);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const coloredLight1 = new THREE.PointLight(product.color, 12, 50);
    coloredLight1.position.set(-8, 5, -5);
    scene.add(coloredLight1);

    const coloredLight2 = new THREE.PointLight(0xa855f7, 8, 50); // Pink/violet side fill
    coloredLight2.position.set(8, -5, 5);
    scene.add(coloredLight2);

    // GEOMETRY GENERATOR based on product info
    let geometry: THREE.BufferGeometry;
    
    switch (product.threeDType) {
      case "torus":
        geometry = new THREE.TorusGeometry(3.2, 1.1, 16, 100);
        break;
      case "cube":
        geometry = new THREE.BoxGeometry(4.2, 4.2, 4.2);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(3.6, 32, 32);
        break;
      case "knot":
      default:
        geometry = new THREE.TorusKnotGeometry(2.4, 0.8, 120, 16);
        break;
    }

    // MATERIAL SELECTION
    let material: THREE.Material;

    if (meshStyle === "wireframe") {
      material = new THREE.MeshBasicMaterial({
        color: product.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: product.color,
        roughness: 0.15,
        metalness: 0.85,
        flatShading: false,
        bumpScale: 0.05,
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Outer faint rotation accent ring
    const ringGeo = new THREE.RingGeometry(5.2, 5.3, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.08,
      transparent: true,
      side: THREE.DoubleSide
    });
    const accentRing = new THREE.Mesh(ringGeo, ringMat);
    accentRing.rotation.x = Math.PI / 2;
    scene.add(accentRing);

    // MOUSE INTERACTION ROTATION
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      mesh.rotation.y += dx * 0.007;
      mesh.rotation.x += dy * 0.007;

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // RESIZE HANDLING
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let age = 0;
    let animFrame: number;

    const animate = () => {
      animFrame = requestAnimationFrame(animate);

      // Baseline continuous rotations
      if (!isDragging) {
        mesh.rotation.y += spinSpeed;
        mesh.rotation.x += spinSpeed * 0.4;
      }

      // Sine wave hovering displacement height simulation
      age += 0.02;
      mesh.position.y = Math.sin(age) * 0.4;
      accentRing.position.y = Math.sin(age) * 0.2 - 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };

  }, [product, meshStyle, spinSpeed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] bg-indigo-950/10 rounded-2xl overflow-hidden border border-white/5 backdrop-blur-sm cursor-grab active:cursor-grabbing flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Floating HUD controls for styling styling options */}
      <div className="absolute top-3 left-3 z-10 flex flex-col pointer-events-auto">
        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
          Dynamic Mesh Core
        </span>
        <span className="text-sm font-semibold text-white tracking-tight">
          {product.name}
        </span>
      </div>

      {/* Render options overlay */}
      <div className="absolute bottom-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex gap-1.5 bg-slate-950/75 p-1 rounded-lg border border-white/5 backdrop-blur-sm">
          <button
            onClick={() => setMeshStyle("solid")}
            className={`px-2 py-0.5 text-[9px] font-mono tracking-tight rounded duration-200 uppercase ${
              meshStyle === "solid"
                ? "bg-indigo-600 text-white font-medium"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Matte Chrome
          </button>
          <button
            onClick={() => setMeshStyle("wireframe")}
            className={`px-2 py-0.5 text-[9px] font-mono tracking-tight rounded duration-200 uppercase ${
              meshStyle === "wireframe"
                ? "bg-indigo-600 text-white font-medium"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Hologram
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/75 px-2 py-1 rounded-lg border border-white/5 backdrop-blur-sm">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Velocity</span>
          <select
            value={spinSpeed.toString()}
            onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
            className="bg-transparent text-[9px] font-mono text-indigo-400 outline-none cursor-pointer"
          >
            <option value="0.003">Low</option>
            <option value="0.008">Mid</option>
            <option value="0.018">Warp</option>
          </select>
        </div>
      </div>
    </div>
  );
}
