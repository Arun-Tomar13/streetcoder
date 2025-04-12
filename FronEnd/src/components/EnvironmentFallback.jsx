import React from 'react';
import { Environment } from '@react-three/drei';

// A fallback environment component that offers multiple presets and handles errors gracefully
export function SafeEnvironment({ preset = 'sunset', fallbacks = ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'park', 'lobby'] }) {
  const [currentPreset, setCurrentPreset] = React.useState(preset);
  const [errorCount, setErrorCount] = React.useState(0);

  // If we've tried all fallbacks and still have errors, just render a simple environment
  if (errorCount >= fallbacks.length) {
    return (
      <>
        <ambientLight intensity={1} />
        <hemisphereLight intensity={0.7} />
      </>
    );
  }

  const handleError = () => {
    // Try the next preset in the fallbacks array
    const nextIndex = (fallbacks.indexOf(currentPreset) + 1) % fallbacks.length;
    setCurrentPreset(fallbacks[nextIndex]);
    setErrorCount(prev => prev + 1);
  };

  return (
    <Environment 
      preset={currentPreset} 
      onError={handleError}
    />
  );
}

export default SafeEnvironment; 