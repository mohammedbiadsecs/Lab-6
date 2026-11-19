import React from 'react';
import {Composition} from 'remotion';
import {TestClip} from './test-clip';
import {BinarySearch} from './binary-search';

export const Root: React.FC = () => <>
  <Composition
    id="TestClip"
    component={TestClip}
    durationInFrames={150}
    fps={30}
    width={1280}
    height={720}
  />
  <Composition id="BinarySearch" component={BinarySearch} durationInFrames={1830} fps={30} width={1280} height={720} />
</>;
