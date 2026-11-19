import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';

const values = [2, 5, 8, 12, 16, 23, 38, 56, 72];
const cyan = '#4cc9f0';
const green = '#42df9b';

const Shell: React.FC<{children: React.ReactNode; kicker: string}> = ({children, kicker}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 75% 25%, #162b45, #0b1222 65%)', color: '#f4f8ff', fontFamily: 'Arial, sans-serif', padding: '68px 84px'}}>
    <div style={{fontSize: 21, fontWeight: 700, color: cyan, letterSpacing: 5, textTransform: 'uppercase'}}>{kicker}</div>
    {children}
    <div style={{position: 'absolute', bottom: 32, left: 84, right: 84, height: 3, background: '#24334a'}} />
  </AbsoluteFill>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return <Shell kicker="Computer science · searching">
    <div style={{marginTop: 100, fontSize: 94, fontWeight: 800, letterSpacing: -4, opacity: interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'})}}>Binary Search</div>
    <div style={{marginTop: 25, fontSize: 39, color: '#b8c8dd'}}>Find a value by halving the search range.</div>
    <div style={{marginTop: 74, display: 'inline-block', border: `2px solid ${cyan}`, borderRadius: 18, padding: '19px 28px', fontSize: 34, fontWeight: 700, color: cyan}}>One rule: the array must be sorted</div>
  </Shell>;
};

const ArrayScene: React.FC<{stage: 'setup' | 'sixteen' | 'thirtyEight' | 'found'}> = ({stage}) => {
  const frame = useCurrentFrame();
  const active = stage === 'sixteen' ? 4 : stage === 'thirtyEight' ? 6 : stage === 'found' ? 7 : -1;
  const eliminatedThrough = stage === 'thirtyEight' || stage === 'found' ? 6 : -1;
  const title = stage === 'setup' ? 'Find 56' : stage === 'sixteen' ? 'Middle = 16' : stage === 'thirtyEight' ? 'New middle = 38' : 'Found: 56';
  const subtitle = stage === 'setup' ? 'Search the sorted array' : stage === 'sixteen' ? '56 is larger → discard 2 through 16' : stage === 'thirtyEight' ? '56 is larger → discard 23 and 38' : 'Three comparisons. One answer.';
  const disappear = interpolate(frame, [75, 105], [1, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Shell kicker="Binary search · step by step">
    <div style={{marginTop: 65, fontSize: 75, fontWeight: 800, color: stage === 'found' ? green : '#f4f8ff'}}>{title}</div>
    <div style={{marginTop: 16, fontSize: 34, color: '#b8c8dd'}}>{subtitle}</div>
    <div style={{display: 'flex', gap: 10, marginTop: 100, justifyContent: 'center'}}>
      {values.map((value, index) => {
        const discarded = index <= eliminatedThrough || (stage === 'sixteen' && index <= 4);
        const previouslyDiscarded = (stage === 'thirtyEight' && index <= 4) || (stage === 'found' && index <= 6);
        const chosen = index === active;
        const found = stage === 'found' && chosen;
        return <div key={value} style={{width: 110, height: 116, borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', fontSize: 41, fontWeight: 800, background: found ? '#17634b' : chosen ? '#164766' : '#1a2a40', border: `3px solid ${found ? green : chosen ? cyan : '#31445f'}`, color: discarded ? '#718399' : '#f4f8ff', opacity: previouslyDiscarded ? 0.2 : discarded ? disappear : 1, scale: chosen ? interpolate(frame, [0, 16], [0.9, 1.06], {extrapolateRight: 'clamp'}) : 1}}>{value}</div>;
      })}
    </div>
    <div style={{marginTop: 38, textAlign: 'center', fontSize: 25, color: '#8faac4'}}>{stage === 'setup' ? 'Start with the full range' : stage === 'sixteen' ? 'Keep the right half' : stage === 'thirtyEight' ? 'Keep only 56 and 72' : 'Target matched'}</div>
  </Shell>;
};

const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  return <Shell kicker="Why binary search is faster">
    <div style={{marginTop: 58, fontSize: 65, fontWeight: 800}}>One million sorted elements</div>
    <div style={{display: 'flex', gap: 28, marginTop: 72}}>
      <div style={{flex: 1, background: '#202d42', borderRadius: 22, padding: 35}}>
        <div style={{fontSize: 35, color: '#c9d6e5'}}>Linear search</div>
        <div style={{fontSize: 54, fontWeight: 800, marginTop: 15}}>O(n)</div>
        <div style={{fontSize: 62, fontWeight: 800, marginTop: 32}}>1,000,000</div>
        <div style={{fontSize: 25, color: '#9fb1c8'}}>worst-case comparisons</div>
      </div>
      <div style={{flex: 1, background: '#123a4c', border: `2px solid ${cyan}`, borderRadius: 22, padding: 35, opacity: interpolate(frame, [12, 35], [0.3, 1], {extrapolateRight: 'clamp'})}}>
        <div style={{fontSize: 35, color: cyan}}>Binary search</div>
        <div style={{fontSize: 54, fontWeight: 800, marginTop: 15}}>O(log n)</div>
        <div style={{fontSize: 62, fontWeight: 800, marginTop: 32, color: green}}>20</div>
        <div style={{fontSize: 25, color: '#9fb1c8'}}>worst-case comparisons</div>
      </div>
    </div>
  </Shell>;
};

const Summary: React.FC = () => <Shell kicker="The takeaway">
  <div style={{marginTop: 75, fontSize: 78, fontWeight: 800}}>Sort. Check middle. Halve.</div>
  <div style={{marginTop: 35, fontSize: 39, color: '#b8c8dd'}}>Repeat until the target is found.</div>
  <div style={{marginTop: 88, fontSize: 42, fontWeight: 700, color: green}}>Binary search: O(log n)</div>
</Shell>;

export const BinarySearch: React.FC = () => <>
  <Sequence from={0} durationInFrames={270}><Intro /><Audio src={staticFile('01-intro.wav')} /></Sequence>
  <Sequence from={270} durationInFrames={270}><ArrayScene stage="setup" /><Audio src={staticFile('02-array.wav')} /></Sequence>
  <Sequence from={540} durationInFrames={240}><ArrayScene stage="sixteen" /><Audio src={staticFile('03-sixteen.wav')} /></Sequence>
  <Sequence from={780} durationInFrames={240}><ArrayScene stage="thirtyEight" /><Audio src={staticFile('04-thirty-eight.wav')} /></Sequence>
  <Sequence from={1020} durationInFrames={240}><ArrayScene stage="found" /><Audio src={staticFile('05-found.wav')} /></Sequence>
  <Sequence from={1260} durationInFrames={360}><Compare /><Audio src={staticFile('06-compare.wav')} /></Sequence>
  <Sequence from={1620} durationInFrames={210}><Summary /><Audio src={staticFile('07-summary.wav')} /></Sequence>
</>;
