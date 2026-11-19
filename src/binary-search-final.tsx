import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';

const A = [2, 5, 8, 12, 16, 23, 38, 56, 72];
const K = {bg: '#071323', blue: '#48c5f2', blueDark: '#173b58', yellow: '#ffd166', green: '#4be39a', grey: '#6d7d91', white: '#f5f9ff', muted: '#b4c8da'};
const limit = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Slide: React.FC<{children: React.ReactNode; tag: string; frames: number}> = ({children, tag, frames}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: 'radial-gradient(circle at 72% 18%, #163552, #071323 70%)', color: K.white, fontFamily: 'Arial, sans-serif', padding: '62px 78px', opacity: interpolate(f, [0, 10, frames - 12, frames - 1], [0, 1, 1, 0], limit)}}>
    <div style={{fontSize: 20, letterSpacing: 4, fontWeight: 800, color: K.blue, textTransform: 'uppercase'}}>{tag}</div>
    {children}
    <div style={{position: 'absolute', left: 78, right: 78, bottom: 30, height: 3, background: '#29445e'}} />
  </AbsoluteFill>;
};

const Heading: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = K.white}) => <div style={{marginTop: 47, fontSize: 65, fontWeight: 800, letterSpacing: -2, lineHeight: 1.08, color}}>{children}</div>;

type DiagramProps = {mid: number; left: number; right: number; previous?: number; discardTo?: number; discardFrom?: number; discardAt?: number; found?: boolean; count?: number; showIndices?: boolean};
const Diagram: React.FC<DiagramProps> = ({mid, left, right, previous = -1, discardTo = -1, discardFrom = 9, discardAt = 9999, found = false, count, showIndices = true}) => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [discardAt, discardAt + 28], [1, 0.2], limit);
  return <div style={{position: 'relative', marginTop: 115}}>
    {count !== undefined && <div style={{position: 'absolute', top: -100, right: 0, border: `2px solid ${K.blue}`, background: '#153650', borderRadius: 13, padding: '12px 20px', fontSize: 23, fontWeight: 800}}>Midpoint checks: {count}</div>}
    <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>{A.map((value, i) => {
      const isMid = i === mid;
      const outside = i < left || i > right;
      const old = i <= previous;
      const newlyDiscarded = i <= discardTo || i >= discardFrom;
      const opacity = old ? 0.2 : newlyDiscarded ? fade : outside ? 0.2 : 1;
      return <div key={i} style={{width: 112, textAlign: 'center', opacity}}>
        <div style={{height: 40, fontSize: 30, color: isMid ? found ? K.green : K.yellow : 'transparent', translate: `0 ${isMid ? interpolate(f, [0, 18], [-13, 0], limit) : 0}px`}}>{isMid ? '↓' : '·'}</div>
        <div style={{height: 111, display: 'grid', placeItems: 'center', background: isMid ? found ? '#176749' : '#655024' : K.blueDark, border: `3px solid ${isMid ? found ? K.green : K.yellow : outside ? K.grey : K.blue}`, borderRadius: 17, fontSize: 39, fontWeight: 800, boxSizing: 'border-box', scale: isMid ? interpolate(f, [0, 17], [0.91, 1.05], limit) : 1, boxShadow: isMid ? `0 0 26px ${found ? '#4be39a' : '#ffd166'}55` : 'none'}}>{value}</div>
        {showIndices && <div style={{fontSize: 20, color: K.muted, marginTop: 10}}>{i}</div>}
        <div style={{height: 32, marginTop: 10, fontSize: 22, fontWeight: 800}}><span style={{color: K.blue}}>{i === left ? 'L' : ''}</span><span style={{color: K.yellow}}>{i === right ? (i === left ? ' / R' : 'R') : ''}</span></div>
      </div>;
    })}</div>
    <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px 16px 0', color: K.muted, fontSize: 22}}><span>← left boundary</span><span>right boundary →</span></div>
  </div>;
};

const Intro: React.FC = () => <Slide tag="Binary Search · the idea" frames={300}>
  <Heading>Find a value by<br /><span style={{color: K.blue}}>halving the range.</span></Heading>
  <div style={{fontSize: 36, marginTop: 52, color: K.muted}}>Check the middle. Keep only the half where the target could be.</div>
  <div style={{marginTop: 64, fontSize: 29, color: K.yellow, fontWeight: 800}}>SORTED ARRAY  →  MIDDLE  →  SMALLER RANGE</div>
</Slide>;

const Requirements: React.FC = () => {
  const f = useCurrentFrame();
  return <Slide tag="Before the first check" frames={450}>
    <Heading>The array must be sorted</Heading>
    <div style={{fontSize: 31, marginTop: 18, color: K.muted}}>Target: <b style={{color: K.yellow}}>56</b> · Left: <b style={{color: K.blue}}>0</b> · Right: <b style={{color: K.yellow}}>8</b></div>
    <Diagram mid={f > 220 ? 4 : -1} left={0} right={8} />
    <div style={{fontSize: 28, textAlign: 'center', marginTop: 5, color: K.blue}}>Order tells us which half cannot contain 56.</div>
  </Slide>;
};

const Middle: React.FC = () => {
  const f = useCurrentFrame();
  return <Slide tag="Choosing the midpoint" frames={450}>
    <Heading>mid = floor((left + right) / 2)</Heading>
    <div style={{fontSize: 37, color: K.yellow, marginTop: 23, fontWeight: 800, opacity: interpolate(f, [35, 70], [0, 1], limit)}}>floor((0 + 8) / 2) = 4</div>
    <Diagram mid={4} left={0} right={8} />
    <div style={{fontSize: 27, color: K.muted, textAlign: 'center'}}>Index 4 points to value 16.</div>
  </Slide>;
};

const Search: React.FC<{phase: 'setup' | 'first' | 'second' | 'found'; frames: number}> = ({phase, frames}) => {
  const f = useCurrentFrame();
  const data = {
    setup: {title: 'Search for 56', note: 'Start with all nine sorted values.', mid: -1, left: 0, right: 8, prior: -1, discard: -1, checks: 0},
    first: {title: '16 is too small', note: '56 > 16  →  discard indices 0 through 4', mid: 4, left: 0, right: 8, prior: -1, discard: 4, checks: 1},
    second: {title: '38 is too small', note: '56 > 38  →  discard indices 5 and 6', mid: 6, left: 5, right: 8, prior: 4, discard: 6, checks: 2},
    found: {title: '56 found!', note: '56 = 56  →  stop after three midpoint checks', mid: 7, left: 7, right: 8, prior: 6, discard: -1, checks: 3},
  }[phase];
  const shiftedLeft = phase === 'first' && f > 210 ? 5 : phase === 'second' && f > 210 ? 7 : data.left;
  return <Slide tag="Worked example · target 56" frames={frames}>
    <Heading color={phase === 'found' ? K.green : K.white}>{data.title}</Heading>
    <div style={{fontSize: 31, marginTop: 18, color: K.muted}}>{data.note}</div>
    <Diagram mid={data.mid} left={shiftedLeft} right={data.right} previous={data.prior} discardTo={data.discard} discardAt={phase === 'setup' || phase === 'found' ? 9999 : 140} found={phase === 'found'} count={data.checks} />
    <div style={{fontSize: 29, color: phase === 'found' ? K.green : K.blue, textAlign: 'center', marginTop: 4}}>{phase === 'setup' ? 'left = 0   ·   right = 8' : phase === 'first' ? 'Next range: indices 5–8  →' : phase === 'second' ? 'Next range: indices 7–8  →' : '✓ Target at index 7'}</div>
  </Slide>;
};

const Missing: React.FC = () => {
  const f = useCurrentFrame();
  const phase = f < 150 ? 0 : f < 300 ? 1 : f < 455 ? 2 : 3;
  const left = phase === 0 ? 0 : phase === 1 ? 5 : 7;
  const right = phase === 3 ? 6 : 8;
  const mid = phase === 3 ? -1 : [4, 6, 7][phase];
  return <Slide tag="When the target is absent" frames={600}>
    <Heading>Search for 50</Heading>
    <div style={{fontSize: 31, marginTop: 18, color: K.muted}}>{phase === 0 ? '16 < 50  →  move left' : phase === 1 ? '38 < 50  →  move left' : phase === 2 ? '56 > 50  →  move right' : 'left = 7, right = 6  →  empty range'}</div>
    <Diagram mid={mid} left={left} right={right} previous={phase === 0 ? -1 : phase === 1 ? 4 : 6} discardFrom={phase === 3 ? 7 : 9} discardAt={phase === 3 ? 0 : 9999} count={Math.min(phase + 1, 3)} />
    <div style={{fontSize: 32, fontWeight: 800, textAlign: 'center', marginTop: 2, color: phase === 3 ? K.yellow : K.blue}}>{phase === 3 ? 'L > R  →  50 is not present' : 'Keep narrowing the possible range →'}</div>
  </Slide>;
};

const Efficiency: React.FC = () => {
  const f = useCurrentFrame();
  const counts = ['1,000,000', '500,000', '250,000', '125,000', '…', '1'];
  return <Slide tag="Why halving is powerful" frames={450}>
    <Heading>Each check cuts the range in half</Heading>
    <div style={{display: 'flex', gap: 14, alignItems: 'end', marginTop: 100}}>{counts.map((n, i) => <div key={n} style={{flex: i === 4 ? 0.4 : 1, textAlign: 'center', opacity: interpolate(f, [i * 34, i * 34 + 18], [0.12, 1], limit)}}><div style={{height: Math.max(28, 172 / (i + 1)), background: i === 5 ? K.green : K.blue, borderRadius: 12, marginBottom: 15}} /><div style={{fontSize: i < 2 ? 22 : 20, fontWeight: 800}}>{n}</div></div>)}</div>
    <div style={{fontSize: 41, color: K.yellow, fontWeight: 800, marginTop: 57}}>O(log n) · at most 20 checks for one million values</div>
    <div style={{fontSize: 27, color: K.muted, marginTop: 24}}>Sorted array → check middle → update a boundary → repeat.</div>
  </Slide>;
};

export const BinarySearchFinal: React.FC = () => <AbsoluteFill style={{backgroundColor: K.bg}}>
  <Sequence from={0} durationInFrames={300}><Intro /><Audio src={staticFile('final-01-intro.wav')} /></Sequence>
  <Sequence from={300} durationInFrames={450}><Requirements /><Audio src={staticFile('final-02-requirements.wav')} /></Sequence>
  <Sequence from={750} durationInFrames={450}><Middle /><Audio src={staticFile('final-03-middle.wav')} /></Sequence>
  <Sequence from={1200} durationInFrames={240}><Search phase="setup" frames={240} /><Audio src={staticFile('final-04-setup.wav')} /></Sequence>
  <Sequence from={1440} durationInFrames={330}><Search phase="first" frames={330} /><Audio src={staticFile('final-05-first.wav')} /></Sequence>
  <Sequence from={1770} durationInFrames={330}><Search phase="second" frames={330} /><Audio src={staticFile('final-06-second.wav')} /></Sequence>
  <Sequence from={2100} durationInFrames={300}><Search phase="found" frames={300} /><Audio src={staticFile('final-07-found.wav')} /></Sequence>
  <Sequence from={2400} durationInFrames={600}><Missing /><Audio src={staticFile('final-08-missing.wav')} /></Sequence>
  <Sequence from={3000} durationInFrames={450}><Efficiency /><Audio src={staticFile('final-09-summary.wav')} /></Sequence>
</AbsoluteFill>;
