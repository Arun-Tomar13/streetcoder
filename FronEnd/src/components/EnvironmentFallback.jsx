import React from 'react';
import { Sky, Stars, Cloud } from '@react-three/drei';

// A completely local environment component that doesn't rely on external HDRI files
export function SafeEnvironment({ preset = 'sunset' }) {
  // Define different environment settings based on preset
  const getEnvironment = () => {
    switch (preset) {
      case 'sunset':
        return (
          <>
            <color attach="background" args={['#fde2c9']} />
            <ambientLight intensity={0.8} />
            <directionalLight 
              position={[-5, 5, 5]} 
              intensity={1.2}
              color="#ff7e5f"
            />
            <Sky 
              sunPosition={[10, 1, 10]} 
              mieCoefficient={0.005}
              mieDirectionalG={0.8}
              rayleigh={0.5}
              turbidity={10}
              distance={450000}
            />
            <Cloud
              scale={[3, 1, 1]}
              position={[3, 5, -10]}
              opacity={0.6}
              speed={0.4}
              segments={5}
            />
          </>
        );
      case 'dawn':
        return (
          <>
            <color attach="background" args={['#d6e4ff']} />
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[0, 2, 5]} 
              intensity={1}
              color="#f9e7c1"
            />
            <Sky 
              sunPosition={[3, 0.2, 10]} 
              mieCoefficient={0.01}
              mieDirectionalG={0.8}
              rayleigh={0.6}
              turbidity={8}
              distance={450000}
            />
            <Cloud
              scale={[3, 1, 1]}
              position={[0, 4, -10]}
              opacity={0.4}
              speed={0.2}
              segments={5}
            />
          </>
        );
      case 'night':
        return (
          <>
            <color attach="background" args={['#04060c']} />
            <ambientLight intensity={0.2} />
            <directionalLight 
              position={[0, 5, 5]} 
              intensity={0.05}
              color="#8eb1eb"
            />
            <Stars radius={100} depth={50} count={1000} factor={4} />
          </>
        );
      default:
        return (
          <>
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={0.8} />
          </>
        );
    }
  };

  return getEnvironment();
}

export default SafeEnvironment; 