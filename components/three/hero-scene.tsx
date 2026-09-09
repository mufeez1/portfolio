"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, Color, Object3D, Vector3 } from "three";
import type { Group, InstancedMesh } from "three";
import { buildLattice } from "@/lib/lattice";
import { useThemeMode } from "@/hooks/use-theme-mode";

/**
 * Palette mirrors the --accent / --line tokens. WebGL cannot resolve oklch()
 * custom properties, so these are the one intentional duplication in the design
 * system; keep them in step with app/globals.css.
 */
const PALETTE = {
  dark: { node: "#8fd0ff", link: "#4a5b6e", packet: "#ffffff" },
  light: { node: "#2f5fe0", link: "#9fb0c4", packet: "#1f3a8a" },
} as const;

const PACKET_COUNT = 10;
const dummy = new Object3D();
const from = new Vector3();
const to = new Vector3();
const at = new Vector3();

interface SceneProps {
  nodeCount: number;
  /** Set false for reduced motion: the scene renders once, statically. */
  animate: boolean;
}

function Lattice({ nodeCount, animate }: SceneProps) {
  const mode = useThemeMode();
  const colors = PALETTE[mode];

  const group = useRef<Group>(null);
  const nodesRef = useRef<InstancedMesh>(null);
  const packetsRef = useRef<InstancedMesh>(null);

  const lattice = useMemo(() => buildLattice(nodeCount), [nodeCount]);

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(lattice.links.length * 6);
    lattice.links.forEach(([a, b], index) => {
      const p = lattice.points[a]!;
      const q = lattice.points[b]!;
      positions.set([p.x, p.y, p.z, q.x, q.y, q.z], index * 6);
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, [lattice]);

  // Node transforms never change, so they are written once rather than per frame.
  useLayoutEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;

    lattice.points.forEach((point, index) => {
      dummy.position.set(point.x, point.y, point.z);
      dummy.scale.setScalar(0.028);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [lattice]);

  useLayoutEffect(() => () => lineGeometry.dispose(), [lineGeometry]);

  /** Each packet walks one link, then hops to the next. Cheap stand-in for traffic. */
  const packets = useMemo(
    () =>
      Array.from({ length: PACKET_COUNT }, (_, index) => ({
        link: (index * 7) % Math.max(1, lattice.links.length),
        progress: (index / PACKET_COUNT) * 1,
        speed: 0.24 + (index % 4) * 0.06,
      })),
    [lattice.links.length],
  );

  useFrame((state, delta) => {
    if (!animate) return;

    // Clamp: a backgrounded tab can hand back a multi-second delta on resume.
    const step = Math.min(delta, 0.05);

    if (group.current) {
      group.current.rotation.y += step * 0.12;
      // Pointer parallax, eased toward the target rather than snapped.
      const targetTilt = state.pointer.y * 0.18;
      group.current.rotation.x += (targetTilt - group.current.rotation.x) * 0.04;
      group.current.position.x +=
        (state.pointer.x * 0.08 - group.current.position.x) * 0.04;
    }

    const mesh = packetsRef.current;
    if (!mesh || lattice.links.length === 0) return;

    packets.forEach((packet, index) => {
      packet.progress += step * packet.speed;
      if (packet.progress > 1) {
        packet.progress = 0;
        packet.link = (packet.link + 3) % lattice.links.length;
      }

      const [a, b] = lattice.links[packet.link]!;
      const p = lattice.points[a]!;
      const q = lattice.points[b]!;
      from.set(p.x, p.y, p.z);
      to.set(q.x, q.y, q.z);
      at.lerpVectors(from, to, packet.progress);

      dummy.position.copy(at);
      // Fade in and out at the endpoints so packets appear to enter each node.
      const fade = Math.sin(packet.progress * Math.PI);
      dummy.scale.setScalar(0.022 * fade);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group} scale={1.55}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={new Color(colors.link)} transparent opacity={0.55} />
      </lineSegments>

      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, lattice.points.length]}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color={new Color(colors.node)} />
      </instancedMesh>

      <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKET_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={new Color(colors.packet)} />
      </instancedMesh>
    </group>
  );
}

interface HeroSceneProps extends SceneProps {
  /** "demand" parks the render loop when the canvas is off screen or hidden. */
  frameloop: "always" | "demand";
  /** Fired once the WebGL context exists, so the fallback can cross-fade out. */
  onReady?: () => void;
}

export default function HeroScene({
  nodeCount,
  animate,
  frameloop,
  onReady,
}: HeroSceneProps) {
  return (
    <Canvas
      frameloop={frameloop}
      onCreated={onReady}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
    >
      <Lattice nodeCount={nodeCount} animate={animate} />
    </Canvas>
  );
}
