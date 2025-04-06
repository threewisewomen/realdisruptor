"use client";
import React, { useRef, Suspense, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber"; // No GroupProps import needed here
import {
  Environment,
  Preload,
  Plane,
  Box,
  Cylinder,
  Grid,
  GradientTexture,
  Text,
} from "@react-three/drei";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// --- 3D Scene Components ---

// Define a type alias for the R3F group props
type R3FGroupProps = JSX.IntrinsicElements["group"];

// Low-Poly Retro Car Component (Now takes a ref)
// Extend the type alias instead of the complex type directly
interface RetroCarProps extends R3FGroupProps {
  // Keep carRef if you specifically need to pass the ref *as a prop*
  // If you only use it like <group ref={carRef} ...>,
  // the 'ref' is already part of R3FGroupProps.
  // But your current destructuring { carRef, ...props } suggests you want it as a prop.
  carRef: React.RefObject<THREE.Group>;
}

function RetroCar({ carRef, ...props }: RetroCarProps) {
  const speed = 5; // Adjust speed as needed

  // Simple forward movement + slight bounce
  useFrame((state, delta) => {
    if (carRef.current) {
      carRef.current.position.z -= delta * speed;
      carRef.current.position.y =
        0.25 + Math.sin(state.clock.elapsedTime * speed * 1.5) * 0.03;
    }
  });

  const bodyColor = "#FF00FF";
  const glassColor = "#404050";

  // Use the passed ref on the group element
  return (
    // Pass the ref from props to the actual group element's ref attribute
    <group
      ref={carRef}
      {...props} // Spread the rest of the props
      rotation={[0, Math.PI, 0]}
      castShadow
      receiveShadow
    >
      {/* Main Body */}
      <Box args={[1.8, 0.4, 3.8]} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>
      {/* Roof/Cabin */}
      <Box args={[1.6, 0.4, 2]} position={[0, 0.6, -0.3]} castShadow>
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>
      {/* Windshield */}
      <Box
        args={[1.5, 0.35, 0.1]}
        position={[0, 0.6, 0.75]}
        rotation={[-0.4, 0, 0]}
      >
        <meshStandardMaterial
          color={glassColor}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </Box>
      {/* Rear Window */}
      <Box
        args={[1.5, 0.35, 0.1]}
        position={[0, 0.6, -1.25]}
        rotation={[0.3, 0, 0]}
      >
        <meshStandardMaterial
          color={glassColor}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </Box>
      {/* Hood Wedge */}
      <Box
        args={[1.7, 0.3, 1.5]}
        position={[0, 0.15, 1.4]}
        rotation={[-0.15, 0, 0]}
        castShadow
      >
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      {/* Wheels */}
      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={[-0.95, 0, 1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </Cylinder>
      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={[0.95, 0, 1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </Cylinder>
      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={[-0.95, 0, -1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </Cylinder>
      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={[0.95, 0, -1.2]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </Cylinder>
      {/* Text */}
      <Text
        position={[0, 0.2, -1.92]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        akshay mp
      </Text>
    </group>
  );
}

// ... (Rest of your VaporwaveSunset, Scene, SearchForm, FuturePortfolioPage components remain the same)
// Vaporwave Sunset Background (Unchanged)
function VaporwaveSunset() {
  /* ... Same as before ... */
  return (
    <Plane args={[200, 100]} position={[0, 20, -80]} rotation={[0, 0, 0]}>
      <meshBasicMaterial side={THREE.DoubleSide}>
        <GradientTexture
          stops={[0, 0.4, 0.6, 1]}
          colors={["#FF6AD5", "#FF8F61", "#6D23B6", "#1E0034"]}
          size={1024}
        />
      </meshBasicMaterial>
    </Plane>
  );
}

// Main 3D Scene Component (Handles Camera Following & Scroll)
function Scene() {
  const { camera } = useThree();
  const carRef = useRef<THREE.Group>(null!); // Ref for the car group

  // Framer Motion scroll progress
  const { scrollYProgress } = useScroll(); // Hook needs to be used in a component wrapped with scroll context (usually body)

  // Transform scroll progress (0 to 1) into camera Z distance
  // Start further away (e.g., 8 units), move closer on scroll (e.g., 4 units)
  const cameraZOffset = useTransform(scrollYProgress, [0, 1], [8, 4]);
  const cameraYOffset = useTransform(scrollYProgress, [0, 1], [3, 2]); // Optional: Move camera slightly lower too

  // Target position for smooth camera movement
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (carRef.current) {
      // Calculate desired camera offset based on scroll
      const currentOffset = new THREE.Vector3(
        0, // Keep centered horizontally
        cameraYOffset.get(), // Use scroll-linked Y offset
        cameraZOffset.get() // Use scroll-linked Z offset (distance behind car)
      );

      // Calculate target camera position: Car position + Offset
      targetCameraPosition.copy(carRef.current.position).add(currentOffset);

      // Calculate target lookAt position (slightly in front of the car for smoother feel)
      targetLookAt
        .copy(carRef.current.position)
        .add(new THREE.Vector3(0, 0.5, -2)); // Look slightly ahead/above center

      // Smoothly interpolate camera position and lookAt (LERP)
      camera.position.lerp(targetCameraPosition, delta * 2.0); // Adjust LERP factor (2.0) for responsiveness
      camera.lookAt(targetLookAt);

      // Optional: Keep camera rotation somewhat stable if needed (can cause jitter if LERP is too slow)
      // camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.x, delta * 2.0);
      // camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotation.y, delta * 2.0);
      // camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRotation.z, delta * 2.0);
    }
  });

  return (
    <>
      {/* Fog to blend scene elements */}
      <fog attach="fog" args={["#150025", 15, 60]} />

      {/* Lighting (Unchanged) */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[-10, 5, 5]}
        intensity={1.0}
        color="#FFCCAA"
        castShadow /* ... shadow props ... */
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />
      <pointLight position={[0, 10, -50]} intensity={0.5} color="#FF6AD5" />

      {/* Background Sunset (Unchanged) */}
      <VaporwaveSunset />

      {/* The Car - Pass the ref */}
      <RetroCar carRef={carRef} position={[0, 0, 15]} />

      {/* Environment for reflections (Unchanged) */}
      <Environment preset="night" blur={0.7} />

      {/* Vaporwave Grid Floor (Unchanged) */}
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1.0}
        cellThickness={1}
        cellColor="#FF00FF"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#00FFFF"
        fadeDistance={80}
        fadeStrength={1}
        infiniteGrid
        followCamera={false}
        receiveShadow
      />

      {/* Preload assets */}
      <Preload all />
    </>
  );
}

// --- Placeholder SearchForm Component (Unchanged Styles) ---
function SearchForm({ query }: { query: string }) {
  /* ... Same as before ... */
  const [inputValue, setInputValue] = useState(query || "");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted (placeholder):", inputValue);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mx-auto"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search academic papers..."
        className="flex-grow w-full px-5 py-3 text-base text-white bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-transparent placeholder-gray-400 transition duration-200 ease-in-out [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]"
        style={{ pointerEvents: "auto" }}
      />
      <button
        type="submit"
        className="px-8 py-3 text-base font-semibold text-black bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-500 rounded-lg hover:from-white hover:to-gray-300 transition duration-200 ease-in-out whitespace-nowrap shadow-md hover:shadow-lg"
        style={{ pointerEvents: "auto" }}
      >
        {" "}
        Navigate{" "}
      </button>
    </form>
  );
}

// --- Main Page Component (Layout & Text Styles Updated) ---

export default function FuturePortfolioPage() {
  const [query, setQuery] = useState("");
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15 + 0.4, duration: 0.7, ease: "easeOut" },
    }),
  };
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const textShadowClass = "[text-shadow:0_1px_5px_rgba(0,0,0,0.7)]";

  return (
    // Increase min-height to allow for scrolling
    <div className="relative min-h-[200vh] bg-gradient-to-b from-[#10001E] via-[#1E0034] to-[#000005] text-white overflow-x-hidden">
      {" "}
      {/* Added overflow-x-hidden */}
      {/* Fixed Canvas */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          // Removed initial camera position from here - Scene controls it
          camera={{ fov: 50, near: 0.5, far: 150 }}
        >
          <Suspense fallback={null}>
            {" "}
            <Scene />{" "}
          </Suspense>
        </Canvas>
      </div>
      {/* Content Section - Positioned near the top, leaves space for scroll */}
      {/* Using padding-top instead of justify-center to place it higher */}
      <div className="relative z-10 flex flex-col items-center pt-24 sm:pt-32 md:pt-40 px-4 pointer-events-none">
        <motion.div
          className="text-center max-w-3xl w-full" // Adjusted max-width
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Large Title */}
          <motion.h1
            className={`text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6 text-white ${textShadowClass}`}
            style={{ pointerEvents: "auto" }}
            variants={textVariants}
            custom={0}
          >
            IDEAS WILL COME TO LIFE
          </motion.h1>

          {/* Paragraphs */}
          <motion.p
            className={`text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-4 leading-relaxed ${textShadowClass}`}
            style={{ pointerEvents: "auto" }}
            variants={textVariants}
            custom={1}
          >
            Spot outlier academic papers that rise unexpectedly in influence.
            Navigate the currents of innovation.
          </motion.p>

          <motion.p
            className={`text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed ${textShadowClass}`}
            style={{ pointerEvents: "auto" }}
            variants={textVariants}
            custom={2}
          >
            Be part of the discovery and showcase your ideas for{" "}
            <strong className="font-bold text-cyan-300 uppercase tracking-wide">
              Decentralized Peer Review
            </strong>
            .
          </motion.p>

          {/* Search Form */}
          <motion.div className="mt-8" variants={textVariants} custom={3}>
            <SearchForm query={query} />
          </motion.div>
        </motion.div>
      </div>
      {/* Add Spacer div at the bottom to ensure full scroll height is usable */}
      <div className="h-[100vh]"></div>
    </div>
  );
}
