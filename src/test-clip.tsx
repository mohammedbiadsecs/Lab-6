import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const TestClip: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30, 150], [0.65, 1, 1.08], {extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#101b30', color: '#fff', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: 'Arial, sans-serif', textAlign: 'center', transform: `scale(${scale})`, opacity}}>
        <div style={{fontSize: 82, fontWeight: 700}}>Animation + narration</div>
        <div style={{fontSize: 38, color: '#8bd5ff', marginTop: 26}}>HUJI AICODE Lab 6 test</div>
      </div>
      <Audio src={staticFile('narration.wav')} />
    </AbsoluteFill>
  );
};
