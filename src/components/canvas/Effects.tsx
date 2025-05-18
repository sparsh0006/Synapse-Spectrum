// src/components/canvas/Effects.tsx
import React from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

const Effects: React.FC = () => {
  return (
    <EffectComposer>
      <Bloom
        kernelSize={KernelSize.HUGE}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.2}
        intensity={0.8}
        mipmapBlur={true}
      />
    </EffectComposer>
  );
};

export default Effects;