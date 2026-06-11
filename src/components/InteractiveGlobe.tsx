import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { initialOrders } from "../data";

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>("Global Core Network");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Dimensions
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x2a1b4e, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 4); // Indigo
    dirLight1.position.set(200, 150, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 3); // Pink glow
    dirLight2.position.set(-200, -150, -100);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xa855f7, 5, 300);
    pointLight.position.set(0, 0, 150);
    scene.add(pointLight);

    // GLOBE GROUP
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Base Sphere Mesh (Glassy translucent ocean)
    const sphereGeo = new THREE.SphereGeometry(76, 40, 40);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x070714,
      emissive: 0x0d0c22,
      specular: 0x6366f1,
      shininess: 40,
      transparent: true,
      opacity: 0.85,
    });
    const globeBase = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeBase);

    // Grid Sphere Mesh (Tech grid)
    const wireGeo = new THREE.SphereGeometry(76.2, 28, 28);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const globeWire = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(globeWire);

    // Coordinate Dots (Continents / Grid alignment points)
    const dotGeo = new THREE.SphereGeometry(0.8, 4, 4);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.7 });

    // Generate pseudo land-mass constellations
    const dotDensity = 160;
    const dotsGroup = new THREE.Group();
    for (let i = 0; i < dotDensity; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const r = 76.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Group together into continental clumps
      const distanceToUSA = Math.sqrt((x - 45) ** 2 + (y - 45) ** 2 + (z - 45) ** 2);
      const distanceToEurope = Math.sqrt((x + 10) ** 2 + (y - 50) ** 2 + (z - 55) ** 2);
      const distanceToAsia = Math.sqrt((x + 55) ** 2 + (y - 25) ** 2 + (z + 45) ** 2);
      
      if (distanceToUSA < 45 || distanceToEurope < 40 || distanceToAsia < 50 || Math.random() < 0.15) {
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(x, y, z);
        dotsGroup.add(dot);
      }
    }
    globeGroup.add(dotsGroup);

    // Shipping Route Arcs & Order Hub Points
    interface OrderPoint {
      mesh: THREE.Mesh;
      ringMesh: THREE.Line;
      lat: number;
      lon: number;
      label: string;
    }
    const orderPoints: OrderPoint[] = [];

    initialOrders.forEach((o, index) => {
      // Map spherical coordinates based on index and some offset
      const phi = (0.2 + (index * 0.35)) * Math.PI;
      const theta = (0.1 + (index * 0.45)) * Math.PI * 2;
      const r = 76.8;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Hub dot mesh
      const hubGeo = new THREE.SphereGeometry(2.2, 8, 8);
      const hubMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.set(x, y, z);
      globeGroup.add(hub);

      // Glowing pulsing ring
      const ringGeo = new THREE.RingGeometry(2.5, 4.5, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, 4.5, 0, Math.PI * 2).getPoints()
      ), new THREE.LineBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.8 }));
      
      ring.position.set(x, y, z);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ring);

      orderPoints.push({
        mesh: hub,
        ringMesh: ring,
        lat: phi,
        lon: theta,
        label: o.region,
      });

      // Draw route arc to next hub
      if (index > 0) {
        const prev = orderPoints[index - 1];
        const startVec = new THREE.Vector3(prev.mesh.position.x, prev.mesh.position.y, prev.mesh.position.z);
        const endVec = new THREE.Vector3(x, y, z);
        
        // Draw Quadratic Bezier arc
        const midVec = new THREE.Vector3()
          .addVectors(startVec, endVec)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(100); // loft the center high above sphere

        const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
        const points = curve.getPoints(32);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const curveMat = new THREE.LineBasicMaterial({
          color: 0x6366f1,
          transparent: true,
          opacity: 0.45,
          linewidth: 1
        });
        const arcLine = new THREE.Line(curveGeo, curveMat);
        globeGroup.add(arcLine);
      }
    });

    // STARS BACKGROUND CORONA
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 200;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = 180 + Math.random() * 80;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      transparent: true,
      opacity: 0.4,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // MOUSE ORBIT CONTROLS
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.002;
    let targetRotationY = 0.0015;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      
      targetRotationX = 0;
      targetRotationY = 0;
    };

    const handleMouseUp = () => {
      isDragging = false;
      // standard slight baseline rotation resumes after 2.5s
      setTimeout(() => {
        if (!isDragging) {
          targetRotationX = 0.0006;
          targetRotationY = 0.0015;
        }
      }, 2500);
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // RESPONSIVE RESIZE
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
    let pulseTime = 0;
    let animFrame: number;

    const animate = () => {
      animFrame = requestAnimationFrame(animate);

      // Rotate globe group
      if (!isDragging) {
        globeGroup.rotation.y += targetRotationY;
        globeGroup.rotation.x += targetRotationX;
      }

      // Rotate constellation stars opposite
      starField.rotation.y -= 0.00015;

      // Pulse order hub rings
      pulseTime += 0.04;
      orderPoints.forEach((pt, idx) => {
        const scaleVal = 1 + Math.sin(pulseTime + idx) * 0.4;
        pt.ringMesh.scale.set(scaleVal, scaleVal, scaleVal);
        
        // Find current nearest to viewport to display Active Region
        const tempVector = new THREE.Vector3();
        pt.mesh.getWorldPosition(tempVector);
        if (tempVector.z > 50 && idx === Math.floor((pulseTime / 5) % orderPoints.length)) {
          setActiveRegion(pt.label);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animFrame);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="3d-globe-container"
      className="relative w-full h-[380px] bg-gradient-to-b from-slate-950/10 to-slate-950/80 rounded-2xl overflow-hidden border border-white/5 cursor-grab active:cursor-grabbing backdrop-blur-md"
    >
      {/* HUD Info bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
        <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
          Live Node Ping
        </span>
        <span className="text-sm font-semibold text-white tracking-tight drop-shadow-sm transition-all duration-300">
          📍 {activeRegion}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 pointer-events-none text-right">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          CORE TELEMETRY ACTIVE
        </span>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Orbit control guide overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-[10px] font-mono text-slate-400/80 tracking-wide bg-slate-900/45 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          Click & drag to orbit coordinates
        </span>
      </div>
    </div>
  );
}
