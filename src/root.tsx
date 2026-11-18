import React from 'react';
import {Composition} from 'remotion';
import {TestClip} from './test-clip';

export const Root: React.FC = () => (
  <Composition
    id="TestClip"
    component={TestClip}
    durationInFrames={150}
    fps={30}
    width={1280}
    height={720}
  />
);
