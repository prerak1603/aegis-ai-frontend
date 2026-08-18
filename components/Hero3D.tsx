"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";

const SIGNAL = "#4cd3db";
const PACKET_COLOR = "#bff4f7"; // bright tint of signal, same teal family
const SEVERITY_COLORS = ["#34c98e", "#e8a73b", "#e8763b", "#e8453b"];

const PARTICLE_COUNT_DESKTOP = 480;
const PARTICLE_COUNT_REDUCED = 220; // touch / coarse-pointer devices
const FLAGGED_RATIO = 0.07; // ~7% of flows get "flagged" in the animation

const CONNECT_DISTANCE = 1.5; // constellation line threshold
const NEIGHBOR_K = 3; // candidate neighbors precomputed per particle
const LINE_OPACITY = 0.12;

const PACKET_COUNT = 5;
const PACKET_DURATION = 1.4; // seconds a particle stays "streaking"
const PACKET_INTERVAL_MIN = 5;
const PACKET_INTERVAL_MAX = 9;
const STREAK_SPEED_MULT = 6;
const STREAK_SCALE_MULT = 1.7;

const PARALLAX_STRENGTH_X = 0.55;
const PARALLAX_STRENGTH_Y = 0.35;
const PARALLAX_EASE = 0.035; // slow, ambient lerp — not jittery

type Particle = {
  seed: number;
  lane: number; // y position, fixed per particle
  depth: number; // z position, fixed per particle
  speed: number;
  flagged: boolean;
  severityColor: string;
  travel: number; // accumulated distance along x, integrated with delta
  streakUntil: number; // elapsed-time timestamp when the packet effect ends (0 = idle)
};

/**
 * True on touch / coarse-pointer devices — there's no cursor to parallax
 * toward. Resolved synchronously on the first client render (not via an
 * effect that flips it a tick later) so Canvas-level props derived from it
 * never change value right after mount.
 */
function useNoCursor() {
  const [noCursor, setNoCursor] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(pointer: coarse)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setNoCursor(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return noCursor;
}

/** True on touch devices OR narrow viewports — cuts particle/line density for perf. */
function useLowPower() {
  const [lowPower, setLowPower] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(pointer: coarse), (max-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setLowPower(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return lowPower;
}

function FlowField({ noCursor, lowPower }: { noCursor: boolean; lowPower: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nextBurstRef = useRef(3); // first packet burst a few seconds after mount

  const particleCount = lowPower ? PARTICLE_COUNT_REDUCED : PARTICLE_COUNT_DESKTOP;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, () => {
      const flagged = Math.random() < FLAGGED_RATIO;
      const seed = Math.random() * 40 - 20;
      return {
        seed,
        lane: (Math.random() - 0.5) * 8,
        depth: (Math.random() - 0.5) * 6,
        speed: 0.4 + Math.random() * 0.5,
        flagged,
        severityColor:
          SEVERITY_COLORS[Math.floor(Math.random() * SEVERITY_COLORS.length)],
        travel: seed,
        streakUntil: 0,
      };
    });
  }, [particleCount]);

  const refs = useRef<(THREE.Object3D | null)[]>([]);

  // Candidate neighbor pairs, precomputed once from each particle's fixed
  // lane/depth (not its drifting x) — cheap at mount, avoids an O(n^2) scan
  // every frame. Skipped on low-power devices (no constellation lines there).
  const neighborPairs = useMemo<[number, number][]>(() => {
    if (lowPower) return [];
    const pairsSeen = new Set<string>();
    const pairs: [number, number][] = [];
    for (let i = 0; i < particles.length; i++) {
      const distances: { j: number; d: number }[] = [];
      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;
        const dy = particles[i].lane - particles[j].lane;
        const dz = particles[i].depth - particles[j].depth;
        distances.push({ j, d: dy * dy + dz * dz });
      }
      distances.sort((a, b) => a.d - b.d);
      for (let k = 0; k < NEIGHBOR_K && k < distances.length; k++) {
        const j = distances[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!pairsSeen.has(key)) {
          pairsSeen.add(key);
          pairs.push(i < j ? [i, j] : [j, i]);
        }
      }
    }
    return pairs;
  }, [particles, lowPower]);

  const maxSegments = neighborPairs.length;
  const linePositions = useMemo(
    () => new Float32Array(Math.max(maxSegments, 1) * 2 * 3),
    [maxSegments]
  );
  const lineGeomRef = useRef<THREE.BufferGeometry>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Gentle parallax: the whole field drifts toward the cursor, slowly.
    if (groupRef.current) {
      const targetX = noCursor ? 0 : state.pointer.x * PARALLAX_STRENGTH_X;
      const targetY = noCursor ? 0 : state.pointer.y * PARALLAX_STRENGTH_Y;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        PARALLAX_EASE
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        PARALLAX_EASE
      );
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.15;
    }

    // Periodically send a small handful of particles streaking across the
    // field faster + brighter, like packets moving through a flow.
    if (t > nextBurstRef.current) {
      const available = particles.filter((p) => p.streakUntil < t);
      for (let k = 0; k < PACKET_COUNT && available.length > 0; k++) {
        const idx = Math.floor(Math.random() * available.length);
        const p = available.splice(idx, 1)[0];
        p.streakUntil = t + PACKET_DURATION;
      }
      nextBurstRef.current =
        t + PACKET_INTERVAL_MIN + Math.random() * (PACKET_INTERVAL_MAX - PACKET_INTERVAL_MIN);
    }

    particles.forEach((p, i) => {
      const obj = refs.current[i];
      if (!obj) return;

      const isStreaking = t < p.streakUntil;
      const speedMult = isStreaking ? STREAK_SPEED_MULT : 1;

      // Integrate travel with delta (rather than a pure function of t) so
      // the speed multiplier can change without a visible position jump.
      p.travel += delta * p.speed * speedMult * 3;
      const x = (p.travel % 24) - 12;
      obj.position.set(x, p.lane, p.depth);

      // near the detection plane (x ~ 0), flagged particles flare up
      const distFromPlane = Math.abs(x);
      const isCrossing = p.flagged && distFromPlane < 1.2;
      let scale = isCrossing
        ? 1 + (1.2 - distFromPlane) * 1.8
        : 0.5 + Math.sin(t * 2 + p.seed) * 0.06;
      if (isStreaking) scale *= STREAK_SCALE_MULT;
      obj.scale.setScalar(Math.max(scale, 0.35));

      const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        const targetColor = isStreaking ? PACKET_COLOR : isCrossing ? p.severityColor : SIGNAL;
        const lerpAmount = isStreaking ? 0.5 : isCrossing ? 0.3 : 0.05;
        mat.color.lerp(new THREE.Color(targetColor), lerpAmount);
        mat.emissive.lerp(
          new THREE.Color(targetColor),
          isStreaking ? 0.55 : isCrossing ? 0.25 : 0.02
        );
      }
    });

    // Constellation lines: only draw a segment when two precomputed
    // candidate neighbors are currently within CONNECT_DISTANCE.
    if (!lowPower && lineGeomRef.current && maxSegments > 0) {
      const posAttr = lineGeomRef.current.getAttribute("position") as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      let segCount = 0;
      const connectDistSq = CONNECT_DISTANCE * CONNECT_DISTANCE;

      for (const [i, j] of neighborPairs) {
        const a = refs.current[i];
        const b = refs.current[j];
        if (!a || !b) continue;
        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const dz = a.position.z - b.position.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < connectDistSq) {
          const base = segCount * 6;
          arr[base] = a.position.x;
          arr[base + 1] = a.position.y;
          arr[base + 2] = a.position.z;
          arr[base + 3] = b.position.x;
          arr[base + 4] = b.position.y;
          arr[base + 5] = b.position.z;
          segCount++;
        }
      }
      posAttr.needsUpdate = true;
      lineGeomRef.current.setDrawRange(0, segCount * 2);
    }
  });

  return (
    <group ref={groupRef}>
      {/* limit is fixed at the max capacity so drei's InstancedMesh buffers
          are allocated once — only the number of mounted <Instance>
          children (from `particles`) varies with lowPower. */}
      <Instances limit={PARTICLE_COUNT_DESKTOP}>
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

      {!lowPower && maxSegments > 0 && (
        <lineSegments frustumCulled={false}>
          <bufferGeometry ref={lineGeomRef}>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={SIGNAL}
            transparent
            opacity={LINE_OPACITY}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* detection plane — subtle, marks where flows get analyzed */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[0.015, 9]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  const noCursor = useNoCursor();
  const lowPower = useLowPower();

  return (
    <div className="absolute inset-0" aria-hidden="true" role="presentation">
      <Canvas
        camera={{ position: [0, 0.6, 9], fov: 45 }}
        dpr={lowPower ? [1, 1] : [1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[4, 4, 6]} intensity={40} color="#4cd3db" />
        <pointLight position={[-4, -3, 4]} intensity={20} color="#7c8cf8" />
        <FlowField noCursor={noCursor} lowPower={lowPower} />
      </Canvas>
    </div>
  );
}
