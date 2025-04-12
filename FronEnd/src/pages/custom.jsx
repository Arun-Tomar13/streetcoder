import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Center, 
  OrbitControls, 
  Stars, 
  Environment,
  useGLTF, 
  Line,
  Float,
  PerspectiveCamera,
  Sparkles,
  Loader
} from '@react-three/drei';
import * as THREE from 'three';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SafeEnvironment from '../components/EnvironmentFallback';

// Loading component that will show while 3D content loads
const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <div className="h-16 w-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
        </div>
      </div>
      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
        MARS X
      </h2>
      <p className="text-gray-400">Loading immersive experience...</p>
    </div>
  </div>
);

// Fallback component for 3D canvas
const CanvasFallback = () => (
  // This needs to be fixed - we can't render a div inside Canvas
  null
);

// Enhanced 3D Model component with more dynamic animations and error handling
function Model({ position, rotation, scale, path, hover }) {
  const [error, setError] = useState(false);
  const group = useRef();
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  
  // Create a fallback model if the model fails to load
  const FallbackModel = () => {
    return (
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={path.includes("mars") ? "#c1440e" : path.includes("earth") ? "#2244aa" : "#aaaaaa"} />
      </mesh>
    );
  };
  
  // Load model with error handling
  const { nodes, materials } = useGLTF(path, undefined, (e) => {
    console.error(`Error loading model: ${path}`, e);
    setError(true);
  });
  
  useFrame((state) => {
    if (group.current) {
      // More dynamic rotation based on mouse position
      group.current.rotation.y += 0.005;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      if (hover || hovered) {
        // More complex floating animation
        group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 + position[1];
        group.current.scale.set(
          scale[0] * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.05),
          scale[1] * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.05),
          scale[2] * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
        );
      }
    }
  });

  return (
    <group 
      ref={group} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {error ? <FallbackModel /> : nodes?.Scene ? <primitive object={nodes.Scene} /> : <FallbackModel />}
    </group>
  );
}

  // Enhanced floating text with more dynamic effects
  function FloatingText({ text, position, color = "#ffffff", size = 0.5 }) {
  const textRef = useRef();
    const [hovered, setHovered] = useState(false);
  
    useFrame(({ clock, mouse }) => {
    if (textRef.current) {
        // Basic floating
      textRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.2 + position[1];
        
        // Subtle rotation
      textRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.1;
        
        // If hovered, add extra effects
        if (hovered) {
          textRef.current.rotation.z = Math.sin(clock.elapsedTime * 2) * 0.05;
          textRef.current.scale.set(
            1 + Math.sin(clock.elapsedTime * 3) * 0.1,
            1 + Math.sin(clock.elapsedTime * 3) * 0.1,
            1 + Math.sin(clock.elapsedTime * 3) * 0.1
          );
        }
    }
  });

  // Simple text mesh as fallback
  return (
    <Center position={position} ref={textRef}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[text.length * 0.5 * size, size, 0.1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 1 : 0.5} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Center>
  );
}

  // Enhanced Hero Section with 3D interactive elements
const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const [currentText, setCurrentText] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  
  const innovationTexts = [
    "SPACE EXPLORATION",
    "NEURAL INTERFACES",
    "SUSTAINABLE ENERGY",
    "AUTONOMOUS SYSTEMS"
  ];
  
  // Typewriter effect
  useEffect(() => {
    let interval = null;
    let currentIndex = 0;
    let isDeleting = false;
    let textToType = innovationTexts[currentText];
    
    const type = () => {
      if (!isDeleting) {
        setTypewriterText(textToType.substring(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex === textToType.length) {
          isDeleting = true;
          clearInterval(interval);
          setTimeout(() => {
            interval = setInterval(type, 80);
          }, 2000);
        }
      } else {
        setTypewriterText(textToType.substring(0, currentIndex));
        currentIndex--;
        
        if (currentIndex === 0) {
          isDeleting = false;
          clearInterval(interval);
          const nextText = (currentText + 1) % innovationTexts.length;
          setCurrentText(nextText);
          textToType = innovationTexts[nextText];
          setTimeout(() => {
            interval = setInterval(type, 100);
          }, 1000);
        }
      }
    };
    
    interval = setInterval(type, 100);
    return () => clearInterval(interval);
  }, [currentText]);

  // Typewriter effect with slowed down animation
  useEffect(() => {
    let interval = null;
    let currentIndex = 0;
    let isDeleting = false;
    let textToType = innovationTexts[currentText];
    
    const type = () => {
      if (!isDeleting) {
        setTypewriterText(textToType.substring(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex === textToType.length) {
          isDeleting = true;
          clearInterval(interval);
          // Increase pause time at the end of typing to 4 seconds
          setTimeout(() => {
            interval = setInterval(type, 100); // Slow down deletion speed
          }, 4000);
        }
      } else {
        setTypewriterText(textToType.substring(0, currentIndex));
        currentIndex--;
        
        if (currentIndex === 0) {
          isDeleting = false;
          clearInterval(interval);
          const nextText = (currentText + 1) % innovationTexts.length;
          setCurrentText(nextText);
          textToType = innovationTexts[nextText];
          // Increase pause time between words to 1.5 seconds
          setTimeout(() => {
            interval = setInterval(type, 50); // Slow down typing speed
          }, 1500);
        }
      }
    };
    
    // Start typing at a slower pace
    interval = setInterval(type, 20);
    return () => clearInterval(interval);
  }, [currentText]);

  // Typewriter effect with slowed down animation (single implementation)
  useEffect(() => {
    let interval = null;
    let currentIndex = 0;
    let isDeleting = false;
    let textToType = innovationTexts[currentText];
    
    const type = () => {
      if (!isDeleting) {
        setTypewriterText(textToType.substring(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex === textToType.length) {
          isDeleting = true;
          clearInterval(interval);
          // Increase pause time at the end of typing to 4 seconds
          setTimeout(() => {
            interval = setInterval(type, 500); // Slow down deletion speed
          }, 4000);
        }
      } else {
        setTypewriterText(textToType.substring(0, currentIndex));
        currentIndex--;
        
        if (currentIndex === 0) {
          isDeleting = false;
          clearInterval(interval);
          const nextText = (currentText + 1) % innovationTexts.length;
          setCurrentText(nextText);
          textToType = innovationTexts[nextText];
          // Increase pause time between words to 1.5 seconds
          setTimeout(() => {
            interval = setInterval(type, 300); // Slow down typing speed
          }, 1500);
        }
      }
    };
    
    // Start typing at a slower pace
    interval = setInterval(type, 150);
    return () => clearInterval(interval);
  }, [currentText]);

  // Typewriter effect with slowed down animation (single implementation)
  useEffect(() => {
    let interval = null;
    let currentIndex = 0;
    let isDeleting = false;
    let textToType = innovationTexts[currentText];
    
    const type = () => {
      if (!isDeleting) {
        setTypewriterText(textToType.substring(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex === textToType.length) {
          isDeleting = true;
          clearInterval(interval);
          // Increase pause time at the end of typing to 4 seconds
          setTimeout(() => {
            interval = setInterval(type, 150); // Slow down deletion speed
          }, 4000);
        }
      } else {
        setTypewriterText(textToType.substring(0, currentIndex));
        currentIndex--;
        
        if (currentIndex === 0) {
          isDeleting = false;
          clearInterval(interval);
          const nextText = (currentText + 1) % innovationTexts.length;
          setCurrentText(nextText);
          textToType = innovationTexts[nextText];
          // Increase pause time between words to 1.5 seconds
          setTimeout(() => {
            interval = setInterval(type, 150); // Slow down typing speed
          }, 1500);
        }
      }
    };
    
    // Start typing at a slower pace
    interval = setInterval(type, 150);
    return () => clearInterval(interval);
  }, [currentText]);

  // Interactive Mars object with mouse follow - fix rotation glitch
  const Mars = ({ position }) => {
    const mesh = useRef();
    const { viewport, mouse } = useThree();
    const initialPosition = useMemo(() => [...position], [position]);
    
    useFrame((state) => {
      if (mesh.current) {
        // Smooth consistent rotation without glitches
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        
        // Subtle movement based on mouse position with easing
        const targetX = (mouse.x * viewport.width) / 50;
        const targetY = (mouse.y * viewport.height) / 50;
        
        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX + initialPosition[0], 0.03);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, -targetY + initialPosition[1], 0.03);
      }
    });
    
    return (
      <mesh ref={mesh} position={initialPosition} scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#4f46e5"
          metalness={0.5}
          roughness={0.7}
          emissive="#2d3a8c"
          emissiveIntensity={0.3}
        >
          <Stars radius={1.2} depth={50} count={500} factor={2} saturation={0} fade speed={1} />
        </meshStandardMaterial>
      </mesh>
    );
  };
  
  // Floating spacecraft that follows cursor
  const Spacecraft = () => {
    const mesh = useRef();
    const { viewport, mouse } = useThree();
    
    useFrame(() => {
      if (mesh.current) {
        // Follow mouse with lag
        const targetX = (mouse.x * viewport.width) / 15;
        const targetY = (mouse.y * viewport.height) / 15;
        
        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, 0.02);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, -targetY, 0.02);
        
        // Tilt based on movement direction
        mesh.current.rotation.z = -targetX * 0.05;
        mesh.current.rotation.x = -targetY * 0.05;
      }
    });
    
    return (
      <group ref={mesh} position={[2, 0, 0]} scale={[0.15, 0.15, 0.15]}>
        {/* Spacecraft body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 1, 4, 16]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Spacecraft nose */}
        <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.5, 1, 16]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Engine glow - changed to indigo/cyan glow */}
        <pointLight position={[0, -2.5, 0]} color="#06b6d4" intensity={5} distance={3} />
        <mesh position={[0, -2.2, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
        
        {/* Wings with indigo accent */}
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 3, 1]} />
          <meshStandardMaterial color="#a5b4fc" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 3, 1]} />
          <meshStandardMaterial color="#a5b4fc" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    );
  };
  
  // Shooting stars effect with smooth initialization
  const ShootingStars = () => {
    const group = useRef();
    const { viewport } = useThree();
    const starsCount = 20;
    const initialFrame = useRef(true);
    
    // Create stars with evenly distributed initial positions
    const stars = useMemo(() => {
      return Array.from({ length: starsCount }).map((_, i) => {
        // Distribute stars evenly across the viewport
        const distributionFactor = i / starsCount;
        
        return {
          position: [
            -viewport.width/2 + viewport.width * distributionFactor * 2 + (Math.random() - 0.5) * 5,
            -viewport.height/2 + viewport.height * Math.random() * 2,
            (Math.random() - 0.5) * 10
          ],
          speed: 0.03 + Math.random() * 0.04, // Reduced speed range for consistency
          size: 0.03 + Math.random() * 0.04,
          trailLength: 0.2 + Math.random() * 0.3 // Add trail length property
        };
      });
    }, [viewport]);
    
    // Single useFrame hook with fixed timing
    useFrame(() => {
      if (group.current) {
        if (initialFrame.current) {
          // Skip initial large movement
          initialFrame.current = false;
          return;
        }
        
        group.current.children.forEach((star, i) => {
          // Move star in diagonal direction with constant speed (independent of time)
          star.position.x -= stars[i].speed;
          star.position.y -= stars[i].speed;
          
          // Reset position when out of view with smooth transition
          if (star.position.x < -viewport.width || star.position.y < -viewport.height) {
            star.position.x = viewport.width / 2 + Math.random() * viewport.width / 3;
            star.position.y = viewport.height / 2 + Math.random() * viewport.height / 3;
          }
        });
      }
    });
    
    return (
      <group ref={group}>
        {stars.map((star, i) => (
          <group key={i} position={star.position}>
            {/* Main star */}
            <mesh>
              <sphereGeometry args={[star.size, 8, 8]} />
              <meshBasicMaterial color="white" />
              <pointLight color="white" intensity={0.3} distance={1.5} />
            </mesh>
            
            {/* Trail effect */}
            <mesh position={[star.speed * star.trailLength, star.speed * star.trailLength, 0]}>
              <sphereGeometry args={[star.size * 0.6, 8, 8]} />
              <meshBasicMaterial color="white" transparent opacity={0.6} />
            </mesh>
            
            <mesh position={[star.speed * star.trailLength * 2, star.speed * star.trailLength * 2, 0]}>
              <sphereGeometry args={[star.size * 0.3, 8, 8]} />
              <meshBasicMaterial color="white" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    );
  };

  // 3D Space Grid
  const SpaceGrid = () => {
    const grid = useRef();
    
    useFrame(({ clock }) => {
      if (grid.current) {
        grid.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
        grid.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      }
    });
    
    return (
      <group ref={grid}>
        {/* Horizontal grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Line
            key={`h-${i}`}
            points={[
              [-15, -5 + i * 1, 0],
              [15, -5 + i * 1, 0]
            ]}
            color="#4f46e5"
            lineWidth={1}
            opacity={0.2}
            transparent
          />
        ))}
        
        {/* Vertical grid lines */}
        {Array.from({ length: 30 }).map((_, i) => (
          <Line
            key={`v-${i}`}
            points={[
              [-15 + i * 1, -5, 0],
              [-15 + i * 1, 5, 0]
            ]}
            color="#06b6d4"
            lineWidth={1}
            opacity={0.2}
            transparent
          />
        ))}
      </group>
    );
  };

  return (
    <motion.section 
      ref={containerRef} 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black"
      style={{ 
        opacity, 
        scale,
        position: 'relative' // Added explicit position
      }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }}
          style={{ background: 'linear-gradient(to bottom, #000000, #0f172a)' }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.1} />
          
          <Suspense fallback={null}>
            <SpaceGrid />
            <Mars position={[3, 0, -2]} />
            <Spacecraft />
            <ShootingStars />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} speed={1} />
            
            {/* Environment helps with lighting */}
            <SafeEnvironment preset="night" />
          </Suspense>
          
          {/* Orbit controls disabled for custom interactions */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={true} 
            enableDamping={false}
          />
        </Canvas>
      </div>
      
      {/* Content overlay */}
      <div className="z-10 container mx-auto px-4 md:px-8 flex flex-col justify-center items-center">
        {/* SpaceX-inspired X logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" className="transform rotate-90">
            <motion.path
              d="M 10,30 L 50,70 L 90,30 M 50,10 L 50,90"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </svg>
        </motion.div>
        
        {/* Main headline */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight text-center"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          MARS<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">X</span>
        </motion.h1>
        
        {/* Typewriter effect */}
        <motion.div
          className="h-12 sm:h-16 flex items-center justify-center mb-6 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light tracking-wide border-r-2 border-indigo-500 pr-2 animate-pulse">
            {typewriterText}
          </span>
        </motion.div>
        
        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-400 max-w-2xl mx-auto font-light text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Accelerating the future through revolutionary technology
        </motion.p>
        
        {/* Call to action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.button
            className="px-8 py-3 bg-indigo-600 text-white rounded-none text-lg font-medium tracking-wider uppercase hover:bg-indigo-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Join the Mission
          </motion.button>
          
          <motion.button
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-none text-lg font-medium tracking-wider uppercase hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More
          </motion.button>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="34" rx="11" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" fill="white">
              <animate 
                attributeName="cy" 
                values="12;22;12" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </circle>
          </svg>
        </motion.div>
      </div>
    </motion.section>
  );
};

  // Enhanced Project Section with futuristic design
const ProjectsSection = () => {
  const projects = [
      { 
        id: 1, 
        title: "Neuralink Interface", 
        description: "A brain-computer interface allowing direct neural control of digital systems",
        tech: "AI, Neural Networks, BCI Hardware"
      },
      { 
        id: 2, 
        title: "SpaceX Starship", 
        description: "Interactive visualization of the Mars colonization vehicle with real-time physics",
        tech: "WebGL, Three.js, Physics Engine"
      },
      { 
        id: 3, 
        title: "Tesla Autopilot", 
        description: "Self-driving visualization platform showing real-time decision making",
        tech: "Computer Vision, TensorFlow, React"
      },
      { 
        id: 4, 
        title: "Hyperloop Concept", 
        description: "Virtual prototype of the next-generation transportation system",
        tech: "3D Modeling, Fluid Dynamics, WebXR"
      }
    ];
  
    const [hoveredProject, setHoveredProject] = useState(null);

  return (
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        {/* Top transition gradient to smoothly blend with Hero section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-0"></div>

        {/* Background lighting effect */}
        <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 to-transparent opacity-50"></div>
        
        <motion.div
          className="absolute top-40 -left-40 w-80 h-80 bg-indigo-600/30 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div
          className="absolute bottom-40 -right-40 w-80 h-80 bg-cyan-600/30 rounded-full filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
      <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, margin: "-100px" }}
      >
          Revolutionary Projects
      </motion.h2>
        
        <motion.p
          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          Transforming multiple industries through advanced technology and forward-thinking design
        </motion.p>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-10 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
              className="project-card bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-700/50"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ 
              scale: 1.05, 
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' 
            }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
          >
              <div className="relative overflow-hidden h-56">
                <motion.div 
                  className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900"
                  animate={{ 
                    scale: hoveredProject === project.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl font-bold text-white/70">{project.title.split(' ')[0]}</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"
                  animate={{
                    opacity: hoveredProject === project.id ? 1 : 0.8
                  }}
                />
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredProject === project.id ? 1 : 0,
                    y: hoveredProject === project.id ? 0 : 20
                  }}
                  transition={{ duration: 0.3 }}
                >
                <motion.button
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium border border-indigo-500/50 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                    Explore Project
                </motion.button>
                </motion.div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <p className="text-xs text-indigo-300">{project.tech}</p>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

  // Enhanced Skills Section with more interactive elements
const SkillsSection = () => {
  const skills = [
      { name: "Artificial Intelligence", level: 0.95, color: "#FF4D4D" },
      { name: "Rocket Engineering", level: 0.9, color: "#FF8F3E" },
      { name: "Sustainable Energy", level: 0.92, color: "#31D490" },
      { name: "Neural Interfaces", level: 0.88, color: "#6175FF" },
      { name: "Autonomous Systems", level: 0.93, color: "#B667F1" },
      { name: "Quantum Computing", level: 0.85, color: "#00C6FF" }
  ];

  return (
      <section className="py-32 bg-gray-800 relative overflow-hidden">
        {/* Dynamic background elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
        
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-indigo-600/10 filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
      <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-4 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Technological Mastery
          </span>
      </motion.h2>
        
        <motion.p
          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Pushing the boundaries of what's possible across multiple disciplines
        </motion.p>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2 h-[500px] relative">
            {/* Loader outside Canvas */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10" id="skills-loader">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            
            <Canvas camera={{ position: [0, 0, 8], fov: 65 }} onCreated={() => {
              const loader = document.getElementById('skills-loader');
              if (loader) loader.style.display = 'none';
            }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Suspense fallback={null}>
                {skills.map((skill, index) => (
                  <FloatingText 
                    key={skill.name}
                    text={skill.name} 
                    position={[
                        Math.cos(index * (Math.PI * 2 / skills.length)) * 4,
                      Math.sin(index * (Math.PI * 2 / skills.length)) * 3,
                      0
                    ]} 
                    color={skill.color} 
                      size={0.4}
                  />
                ))}
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} speed={2} />
                  
                  {/* Replace brain model with a simple 3D brain-like shape */}
                  <group position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
                    {/* Main brain hemisphere */}
                    <mesh>
                      <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                      <meshStandardMaterial color="#ff6699" metalness={0.3} roughness={0.7} />
                    </mesh>
                    
                    {/* Second brain hemisphere */}
                    <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
                      <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                      <meshStandardMaterial color="#ff6699" metalness={0.3} roughness={0.7} />
                    </mesh>
                    
                    {/* Brain details - neural connections represented by small spheres */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <mesh 
                        key={i} 
                        position={[
                          (Math.random() - 0.5) * 3.5,
                          (Math.random() - 0.5) * 3.5,
                          (Math.random() - 0.5) * 3.5
                        ]}
                        scale={[0.1, 0.1, 0.1]}
                      >
                        <sphereGeometry args={[1, 8, 8]} />
                        <meshStandardMaterial color="#4488ff" emissive="#4488ff" emissiveIntensity={0.5} />
                      </mesh>
                    ))}
                  </group>
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.name} 
                className="space-y-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
              <div className="flex justify-between items-center">
                  <motion.h3 
                    className="text-lg font-medium text-white flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <span className="inline-block w-3 h-3 rounded-full mr-3" style={{ backgroundColor: skill.color }}></span>
                    {skill.name}
                  </motion.h3>
                  <span className="text-gray-300 font-mono">{Math.round(skill.level * 100)}%</span>
              </div>
                <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full rounded-full relative"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ backgroundColor: skill.color }}
                  >
                    <motion.div 
                      className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-r from-transparent to-white opacity-30"
                      animate={{
                        x: [20, -40, 20],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.div>
              </div>
                
                <div className="grid grid-cols-10 gap-1 mt-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1 rounded-full"
                      style={{ 
                        backgroundColor: i < skill.level * 10 ? skill.color : 'rgba(75, 85, 99, 0.2)',
                        opacity: i / 10 + 0.3
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.05 + index * 0.1 }}
                    />
                  ))}
            </div>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

  // ... existing code ...
  
  // Enhanced Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
      { 
        id: 1, 
        name: "Dr. Sarah Chen", 
        role: "Director of AI Research", 
        image: "/images/testimonial1.jpg",
        text: "The technological innovations demonstrated here are truly groundbreaking. I've never seen such a seamless integration of multiple cutting-edge technologies." 
      },
      { 
        id: 2, 
        name: "James Williams", 
        role: "CEO of SpaceTech Ventures", 
        image: "/images/testimonial2.jpg",
        text: "Absolutely revolutionary approach to system architecture. The performance metrics are off the charts compared to anything else in the industry today." 
      },
      { 
        id: 3, 
        name: "Dr. Michael Chang", 
        role: "Quantum Computing Lead", 
        image: "/images/testimonial3.jpg",
        text: "The neural interface implementation is years ahead of competitors. Brilliantly executed with attention to both technical excellence and user experience." 
      }
  ];
  
  const [current, setCurrent] = useState(0);
    const testimonialRef = useRef(null);
    const isInView = useInView(testimonialRef);
  
  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);
  
    // Auto-rotate testimonials when in view
    useEffect(() => {
      let interval;
      if (isInView) {
        interval = setInterval(() => {
          setCurrent((current) => (current + 1) % testimonials.length);
        }, 6000);
      }
      return () => clearInterval(interval);
    }, [isInView, testimonials.length]);

  return (
      <section ref={testimonialRef} className="py-32 bg-gray-900 relative overflow-hidden">
        {/* Dynamic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-950/10 to-gray-900"></div>
        
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-600/5 filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
      <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-4 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Industry Recognition
          </span>
      </motion.h2>
        
        <motion.p
          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Feedback from the world's top technology leaders
        </motion.p>
        
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col items-center">
          <div className="relative w-full max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current}
                className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-gray-700/50 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
                {/* Futuristic design elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-70"></div>
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-cyan-500 opacity-70"></div>
                
                <div className="text-6xl text-indigo-500 opacity-50 absolute top-6 left-6 transform -translate-x-2">❝</div>
                
                <motion.p 
                  className="text-xl text-gray-300 mb-8 mt-6 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {testimonials[current].text}
                </motion.p>
                
                <motion.div 
                  className="flex items-center relative z-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src={testimonials[current].image} 
                        alt={testimonials[current].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${testimonials[current].name}&background=6366F1&color=fff`;
                        }}
                      />
              </div>
            </div>
                  <div className="ml-4">
                <h3 className="text-xl font-semibold text-white">{testimonials[current].name}</h3>
                <p className="text-indigo-400">{testimonials[current].role}</p>
            </div>
                </motion.div>
          </motion.div>
        </AnimatePresence>
            
            {/* Navigation buttons */}
            <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
              <motion.button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-indigo-400 border border-indigo-500/30"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            </div>
            
            <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
              <motion.button
          onClick={next}
                className="w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-indigo-400 border border-indigo-500/30"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
              </motion.button>
            </div>
            
            {/* Indicator dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full ${current === index ? 'bg-indigo-500' : 'bg-gray-600'}`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: current === index ? [1, 1.2, 1] : 1,
                    opacity: current === index ? 1 : 0.6,
                  }}
                  transition={{
                    duration: current === index ? 2 : 0.3,
                    repeat: current === index ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
          </div>
      </div>
    </section>
  );
};

// New Timeline Section showcasing innovation milestones
const TimelineSection = () => {
  const milestones = [
    {
      year: "2021",
      title: "Quantum Processor Breakthrough",
      description: "Developed the world's first 128-qubit quantum processor with unprecedented coherence times.",
      icon: "🔬"
    },
    {
      year: "2022",
      title: "Neural Interface Alpha",
      description: "Successfully demonstrated bidirectional neural interface with 90% thought-to-text accuracy.",
      icon: "🧠"
    },
    {
      year: "2023",
      title: "Mars Habitat Prototype",
      description: "Unveiled fully functional Mars habitat prototype with regenerative life support systems.",
      icon: "🪐"
    },
    {
      year: "2024",
      title: "Autonomous Vehicle Network",
      description: "Launched city-wide network of fully autonomous vehicles with zero accident rate.",
      icon: "🚗"
    },
    {
      year: "2025",
      title: "Interplanetary Internet",
      description: "Established first stable high-bandwidth communication network between Earth and Mars orbit.",
      icon: "📡"
    }
  ];

  return (
    <section className="py-32 bg-gray-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
      
      <motion.div
        className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-indigo-600/10 filter blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.h2
        className="text-5xl md:text-6xl font-bold text-center mb-4 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Innovation Timeline
        </span>
      </motion.h2>
      
      <motion.p
        className="text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        A history of breakthrough achievements pushing humanity forward
      </motion.p>
      
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-cyan-500 to-indigo-500 opacity-30"></div>
        
        {milestones.map((milestone, index) => (
          <motion.div 
            key={milestone.year}
            className={`flex flex-col md:flex-row items-start mb-16 relative ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Timeline node */}
            <motion.div 
              className="absolute left-0 md:left-1/2 transform -translate-x-2 md:-translate-x-1/2 w-8 h-8 rounded-full border-2 border-indigo-500 bg-gray-900 z-10 flex items-center justify-center text-2xl"
              whileHover={{ scale: 1.2, backgroundColor: "#4f46e5" }}
              animate={{
                boxShadow: ["0 0 0 rgba(99, 102, 241, 0)", "0 0 15px rgba(99, 102, 241, 0.7)", "0 0 0 rgba(99, 102, 241, 0)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <span>{milestone.icon}</span>
            </motion.div>
            
            {/* Content */}
            <div className={`pl-12 md:pl-0 md:pr-0 ${
              index % 2 === 0 ? 'md:pl-10 md:w-1/2 text-left' : 'md:pr-10 md:w-1/2 md:text-right'
            }`}>
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 relative overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(99, 102, 241, 0.2)" }}
              >
                {/* Decorative corner */}
                <div className={`absolute h-10 w-10 border-t-2 border-l-2 border-indigo-500/30 top-0 left-0`}></div>
                <div className={`absolute h-10 w-10 border-b-2 border-r-2 border-indigo-500/30 bottom-0 right-0`}></div>
                
                <div className="inline-block text-gray-300 text-sm font-mono px-2 py-1 bg-gray-700/50 rounded-md mb-2">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                <p className="text-gray-400">{milestone.description}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// New Contact Section with futuristic design
const ContactSection = () => {
  const formRef = useRef(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(null); // null, 'sending', 'success', 'error'
  
  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormState({ name: '', email: '', message: '' });
      
      // Reset after 3 seconds
      setTimeout(() => setFormStatus(null), 3000);
    }, 1500);
  };

  return (
    <section className="py-32 bg-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <motion.div
        className="absolute top-40 left-20 w-96 h-96 rounded-full bg-indigo-600/10 filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div
        className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-cyan-600/10 filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.h2
        className="text-5xl md:text-6xl font-bold text-center mb-4 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Join the Mission
        </span>
      </motion.h2>
      
      <motion.p
        className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Connect with us to be part of the next generation of innovation
      </motion.p>
      
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2">
          <div className="h-[500px] relative">
            {/* Loader outside Canvas */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10" id="contact-loader">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            
            <Canvas camera={{ position: [0, 0, 8], fov: 65 }} onCreated={() => {
              const loader = document.getElementById('contact-loader');
              if (loader) loader.style.display = 'none';
            }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Suspense fallback={null}>
                {/* Earth-like planet using a simple sphere instead of loading a model */}
                <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1.3, 1.3, 1.3]}>
                  <sphereGeometry args={[1, 32, 32]} />
                  <meshStandardMaterial color="#2244cc" metalness={0.4} roughness={0.7} />
                </mesh>
                
                <FloatingText 
                  text="CONTACT" 
                  position={[0, 2.5, 0]} 
                  color="#00c8ff" 
                  size={0.5} 
                />
                
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} speed={1} />
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
            
            {/* Floating elements overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              {Array.from({ length: 9 }).map((_, i) => (
        <motion.div 
                  key={i}
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 10,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <div className="w-8 h-8 border border-indigo-500/20 rounded-full"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-indigo-500/30"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-indigo-500/30"></div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Transmission</h3>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Your Name</label>
                  <motion.div
                    className="relative overflow-hidden rounded-lg border border-gray-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-300"
                    whileHover={{ borderColor: "rgb(99, 102, 241)", boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" }}
                  >
              <input 
                type="text" 
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                required 
                      className="block w-full bg-gray-800/50 text-gray-300 px-4 py-3 outline-none"
                      placeholder="Jane Doe"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
            </div>
                
            <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Your Email</label>
                  <motion.div
                    className="relative overflow-hidden rounded-lg border border-gray-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-300"
                    whileHover={{ borderColor: "rgb(99, 102, 241)", boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" }}
                  >
              <input 
                type="email" 
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                required 
                      className="block w-full bg-gray-800/50 text-gray-300 px-4 py-3 outline-none"
                      placeholder="jane@example.com"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
            </div>
                
            <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Your Message</label>
                  <motion.div
                    className="relative overflow-hidden rounded-lg border border-gray-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-300"
                    whileHover={{ borderColor: "rgb(99, 102, 241)", boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" }}
                  >
              <textarea 
                      name="message"
                      value={formState.message}
                      onChange={handleInputChange}
                required
                      rows={4}
                      className="block w-full bg-gray-800/50 text-gray-300 px-4 py-3 outline-none resize-none"
                      placeholder="I'm interested in collaborating on..."
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
            </div>
                
            <motion.button 
              type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-lg text-lg font-medium relative overflow-hidden group"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus === 'sending'}
                >
                  <motion.span 
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ mixBlendMode: "overlay" }}
                  />
                  <span className="relative z-10 flex items-center justify-center">
                    {formStatus === 'sending' ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : formStatus === 'success' ? (
                      <svg className="-ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                    {formStatus === 'sending' ? 'Transmitting...' : 
                     formStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                  </span>
            </motion.button>
          </form>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

// Futuristic Footer 
const Footer = () => {
  return (
    <footer className="py-16 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <motion.h3 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              MARS<span className="text-indigo-500">X</span>
            </motion.h3>
            <motion.p 
              className="text-gray-400 mb-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Pioneering the future of technology across multiple frontiers. Our mission is to accelerate humanity's transition to a multi-planetary species through innovative solutions and visionary design.
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {['twitter', 'linkedin', 'github', 'youtube'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          {[
            { title: "Company", links: ["About", "Careers", "Press", "News"] },
            { title: "Resources", links: ["Blog", "Newsletter", "Events", "Help Center"] },
            { title: "Legal", links: ["Terms", "Privacy", "Cookies", "Licenses"] }
          ].map((column, index) => (
            <motion.div 
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * (index + 2) }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-0 h-px bg-indigo-500 mr-3 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
              </div>
              
        <motion.div 
          className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 MARS<span className="text-indigo-500">X</span>. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-indigo-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 text-sm">Cookies</a>
              </div>
        </motion.div>
            </div>
    </footer>
  );
};

// Main App Component
export default function Elon() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate resource loading
  useEffect(() => {
    // Hide loader after short delay even if real loading isn't done
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="bg-gray-900 min-h-screen text-white overflow-hidden">
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <TimelineSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}