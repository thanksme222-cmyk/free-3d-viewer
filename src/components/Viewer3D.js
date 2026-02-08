import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Viewer3D() {
  const mountRef = useRef(null);
  const [preset, setPreset] = useState("daylight");

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 10);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 5, 5);

    scene.add(ambientLight, hemiLight, dirLight, pointLight);

    // Presets function
    const applyPreset = (name) => {
      switch (name) {
        case "daylight":
          ambientLight.intensity = 0.7;
          hemiLight.intensity = 0.5;
          dirLight.intensity = 1.2;
          pointLight.intensity = 0.5;
          scene.background = new THREE.Color(0xaaaaaa);
          break;
        case "studio":
          ambientLight.intensity = 0.3;
          hemiLight.intensity = 0.2;
          dirLight.intensity = 1.5;
          pointLight.intensity = 0.7;
          scene.background = new THREE.Color(0x111111);
          break;
        case "dramatic":
          ambientLight.intensity = 0.1;
          hemiLight.intensity = 0;
          dirLight.intensity = 2;
          pointLight.intensity = 0.2;
          scene.background = new THREE.Color(0x000000);
          break;
        default:
          break;
      }
    };

    applyPreset(preset);

    // Load model
    const loader = new GLTFLoader();
    loader.load("/models/sample.glb", (gltf) => {
      scene.add(gltf.scene);
    });

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [preset]);

  // Button styles
  const buttonStyle = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ffffffaa",
    color: "#111",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const buttonHover = {
    backgroundColor: "#ffffff",
    transform: "scale(1.05)",
  };

  return (
    <>
      {/* 3D Viewer */}
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100vh", overflow: "hidden" }}
      />

      {/* Preset Buttons */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          display: "flex",
          gap: "10px",
          zIndex: 10,
          flexDirection: "column",
        }}
      >
        {["daylight", "studio", "dramatic"].map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            style={buttonStyle}
            onMouseEnter={(e) =>
              Object.assign(e.target.style, buttonHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.target.style, buttonStyle)
            }
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </>
  );
}
