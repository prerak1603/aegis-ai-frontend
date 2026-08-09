"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";

const SIGNAL = "#4cd3db";
const SEVERITY_COLORS = ["#34c98e", "#e8a73b", "#e8763b", "#e8453b"];
const PARTICLE_COUNT = 180;
const FLAGGED_RATIO = 0.07; // ~7% of flows get "flagged" in the animation

type Particle = {
  seed: number;
  lane: number; // y position, fixed per particle
  depth: number; // z position, fixed per particle
  speed: number;
  flagged: boolean;
  severityColor: string;
};

function FlowField() {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const flagged = Math.random() < FLAGGED_RATIO;
      return {
        seed: Math.random() * 40 - 20,
        lane: (Math.random() - 0.5) * 8,
        depth: (Math.random() - 0.5) * 6,
        speed: 0.4 + Math.random() * 0.5,
        flagged,
        severityColor:
          SEVERITY_COLORS[Math.floor(Math.random() * SEVERITY_COLORS.length)],
      };
    });
  }, []);

  const refs = useRef<(THREE.Object3D | null)[]>([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const obj = refs.current[i];
      if (!obj) return;

      // travel left -> right, wrap around
      let x = ((p.seed + t * p.speed * 3) % 24) - 12;
      obj.position.set(x, p.lane, p.depth);

      // near the detection plane (x ~ 0), flagged particles flare up
      const distFromPlane = Math.abs(x);
      const isCrossing = p.flagged && distFromPlane < 1.2;
      const scale = isCrossing
        ? 1 + (1.2 - distFromPlane) * 1.8
        : 0.5 + Math.sin(t * 2 + p.seed) * 0.06;
      obj.scale.setScalar(Math.max(scale, 0.35));

      const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        const targetColor = isCrossing ? p.severityColor : SIGNAL;
        mat.color.lerp(new THREE.Color(targetColor), isCrossing ? 0.3 : 0.05);
        mat.emissive.lerp(
          new THREE.Color(targetColor),
          isCrossing ? 0.25 : 0.02
        );
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances limit={PARTICLE_COUNT}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial
          color={SIGNAL}
          emissive={SIGNAL}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
        {particles.map((p, i) => (
          <Instance
            key={i}
            ref={(el: THREE.Object3D | null) => {
              refs.current[i] = el;
            }}
          />
        ))}
      </Instances>

      {/* detection plane — subtle, marks where flows get analyzed */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[0.015, 9]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        camera={{ position: [0, 0.6, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[4, 4, 6]} intensity={40} color="#4cd3db" />
        <pointLight position={[-4, -3, 4]} intensity={20} color="#7c8cf8" />
        <FlowField />
      </Canvas>
    </div>
  );
}
