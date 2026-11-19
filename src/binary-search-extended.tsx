import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';

const numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72];
const C = {bg: '#081324', panel: '#172a43', edge: '#36516f', text: '#f5f8ff', muted: '#bdd0e4', cyan: '#56d9f6', green: '#51e8a4', amber: '#ffcb66', red: '#ff7886'};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Scene: React.FC<{children: React.ReactNode; label: string; duration: number}> = ({children, label, duration}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: 'radial-gradient(circle at 78% 20%, #183654, #081324 68%)', padding: '64px 80px', color: C.text, fontFamily: 'Arial, sans-serif', opacity: interpolate(f, [0, 10, duration - 10, duration - 1], [0, 1, 1, 0], clamp)}}>
    <div style={{fontSize: 21, fontWeight: 800, letterSpacing: 4, color: C.cyan, textTransform: 'uppercase'}}>{label}</div>
    {children}
    <div style={{position: 'absolute', bottom: 30, left: 80, right: 80, height: 3, background: '#29435e'}} />
  </AbsoluteFill>;
};

const Title: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.text}) => <div style={{fontSize: 66, fontWeight: 800, lineHeight: 1.1, marginTop: 56, color, letterSpacing: -2}}>{children}</div>;

const Cells: React.FC<{active?: number; dimThrough?: number; preDimThrough?: number; dimAfter?: number; found?: boolean; left?: number; right?: number; counter?: number; linear?: boolean}> = ({active = -1, dimThrough = -1, preDimThrough = -1, dimAfter = 0, found = false, left, right, counter, linear = false}) => {
  const f = useCurrentFrame();
  const dim = interpolate(f, [dimAfter, dimAfter + 30], [1, 0.16], clamp);
  return <div style={{position: 'relative', display: 'flex', justifyContent: 'center', gap: 9, marginTop: 130}}>
    {numbers.map((n, i) => {
      const selected = i === active;
      const faded = i <= dimThrough && (!selected || f > dimAfter);
      return <div key={n} style={{position: 'relative', width: 112, height: 116, boxSizing: 'border-box', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected ? found ? '#17674f' : '#164c68' : C.panel, border: `3px solid ${selected ? found ? C.green : linear ? C.amber : C.cyan : C.edge}`, color: C.text, fontSize: 41, fontWeight: 800, scale: selected ? interpolate(f, [0, 18], [0.92, 1.06], clamp) : 1, opacity: i <= preDimThrough ? 0.16 : faded ? dim : 1, boxShadow: selected ? `0 0 28px ${found ? '#2dba80' : '#2bb5d8'}55` : 'none'}}>
        {n}
        {selected && <div style={{position: 'absolute', top: -78, fontSize: 46, color: found ? C.green : linear ? C.amber : C.cyan, translate: `0 ${interpolate(f, [0, 18], [-14, 0], clamp)}px`}}>↓</div>}
        {left === i && <div style={{position: 'absolute', bottom: -61, fontSize: 23, fontWeight: 800, color: C.green}}>L ↑</div>}
        {right === i && <div style={{position: 'absolute', bottom: -61, fontSize: 23, fontWeight: 800, color: C.amber}}>R ↑</div>}
      </div>;
    })}
    {counter !== undefined && <div style={{position: 'absolute', right: 0, top: -140, background: '#1d3d56', border: `2px solid ${C.cyan}`, borderRadius: 15, padding: '14px 22px', fontSize: 25, fontWeight: 700}}>Midpoint checks: {counter}</div>}
  </div>;
};

const Opening: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene label="The search problem" duration={300}>
    <div style={{fontSize: 79, fontWeight: 800, lineHeight: 1.08, marginTop: 86, opacity: interpolate(f, [8, 28], [0, 1], clamp)}}>A million numbers.<br /><span style={{color: C.cyan}}>How do you find one?</span></div>
    <div style={{fontSize: 34, color: C.muted, marginTop: 50}}>Checking every item can take a million steps.</div>
  </Scene>;
};

const Linear: React.FC = () => {
  const f = useCurrentFrame();
  const active = Math.min(7, Math.floor(Math.max(0, f - 40) / 44));
  return <Scene label="First approach · linear search" duration={450}>
    <Title>Check one item at a time</Title>
    <div style={{fontSize: 31, color: C.muted, marginTop: 16}}>Looking for <span style={{color: C.amber, fontWeight: 800}}>56</span> → scan from left to right</div>
    <Cells active={active} dimThrough={active - 1} dimAfter={0} linear />
    <div style={{marginTop: 105, textAlign: 'center', fontSize: 32, color: active === 7 ? C.green : C.amber}}>Comparisons: {active + 1}{active === 7 ? ' · found' : ' · keep going →'}</div>
  </Scene>;
};

const Sorted: React.FC = () => {
  const f = useCurrentFrame();
  const sortedVisible = f > 180;
  return <Scene label="The essential requirement" duration={450}>
    <Title>Binary search needs order</Title>
    <div style={{fontSize: 30, color: C.muted, marginTop: 24}}>A middle value only tells us where to look if the array is sorted.</div>
    <div style={{marginTop: 72, fontSize: 25, color: C.red, fontWeight: 800}}>UNSORTED · no safe half to discard</div>
    <div style={{display: 'flex', gap: 12, marginTop: 14}}>{[56, 8, 72, 2, 23, 5, 38, 12, 16].map((n, i) => <div key={i} style={{width: 105, height: 70, display: 'grid', placeItems: 'center', background: '#2d3047', borderRadius: 12, border: `2px solid ${C.red}`, fontSize: 29, fontWeight: 700}}>{n}</div>)}</div>
    <div style={{fontSize: 34, color: C.cyan, margin: '22px 0', opacity: interpolate(f, [150, 190], [0, 1], clamp)}}>↓ sort first</div>
    <div style={{fontSize: 25, color: C.green, fontWeight: 800, opacity: sortedVisible ? 1 : 0}}>SORTED · each comparison rules out half</div>
    <div style={{display: 'flex', gap: 12, marginTop: 14, opacity: interpolate(f, [180, 220], [0, 1], clamp)}}>{numbers.map(n => <div key={n} style={{width: 105, height: 70, display: 'grid', placeItems: 'center', background: '#183d43', borderRadius: 12, border: `2px solid ${C.green}`, fontSize: 29, fontWeight: 700}}>{n}</div>)}</div>
  </Scene>;
};

const Search: React.FC<{step: 'setup' | 'sixteen' | 'thirtyEight' | 'found'; duration: number}> = ({step, duration}) => {
  const f = useCurrentFrame();
  const config = {
    setup: {title: 'Find 56 in a sorted array', sub: 'Set L to the first index and R to the last.', active: -1, dim: -1, left: 0, right: 8, count: 0},
    sixteen: {title: 'Middle = 16', sub: '56 > 16   →   discard the left half', active: 4, dim: 4, left: 0, right: 8, count: 1},
    thirtyEight: {title: 'New middle = 38', sub: '56 > 38   →   discard left again', active: 6, dim: 6, left: 5, right: 8, count: 2},
    found: {title: 'Middle = 56 · found!', sub: 'Three midpoint checks. Target matched.', active: 7, dim: 6, left: 7, right: 8, count: 3},
  }[step];
  const movingLeft = step === 'sixteen' && f > 155 ? 5 : step === 'thirtyEight' && f > 155 ? 7 : config.left;
  return <Scene label="Binary search · target 56" duration={duration}>
    <Title color={step === 'found' ? C.green : C.text}>{config.title}</Title>
    <div style={{fontSize: 33, color: C.muted, marginTop: 18}}>{config.sub}</div>
    <Cells active={config.active} dimThrough={config.dim} preDimThrough={step === 'thirtyEight' ? 4 : step === 'found' ? 6 : -1} dimAfter={step === 'found' ? 0 : 105} found={step === 'found'} left={movingLeft} right={config.right} counter={config.count} />
    <div style={{marginTop: 100, textAlign: 'center', fontSize: 28, color: step === 'found' ? C.green : C.cyan}}>{step === 'setup' ? 'Search range: all nine elements' : step === 'sixteen' ? 'L moves right → five candidates remain' : step === 'thirtyEight' ? 'L moves right → two candidates remain' : '✓ 56 is at index 7'}</div>
  </Scene>;
};

const Missing: React.FC = () => {
  const f = useCurrentFrame();
  const active = f < 135 ? 4 : f < 255 ? 6 : 7;
  const left = f < 135 ? 0 : f < 255 ? 5 : 7;
  const right = f < 330 ? 8 : 6;
  return <Scene label="What if the target is absent?" duration={450}>
    <Title>Search for 50</Title>
    <div style={{fontSize: 31, color: C.muted, marginTop: 18}}>16 → 38 → 56; then the range becomes empty.</div>
    <Cells active={f < 330 ? active : -1} dimThrough={f < 135 ? -1 : f < 255 ? 4 : f < 330 ? 6 : 8} dimAfter={0} left={f < 330 ? left : undefined} right={f < 330 ? right : undefined} counter={f < 135 ? 1 : f < 255 ? 2 : 3} />
    <div style={{marginTop: 100, textAlign: 'center', fontSize: 34, fontWeight: 800, color: f > 330 ? C.red : C.cyan}}>{f > 330 ? 'L > R  →  50 is not present' : f > 255 ? '50 < 56  →  move R left' : 'Keep the possible half'}</div>
  </Scene>;
};

const Compare: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene label="Why it scales" duration={450}>
    <Title>One million sorted elements</Title>
    <div style={{display: 'flex', gap: 26, marginTop: 74}}>
      <div style={{flex: 1, background: '#253149', borderRadius: 20, padding: 30, border: `2px solid ${C.edge}`}}><div style={{fontSize: 35}}>Linear search</div><div style={{fontSize: 51, marginTop: 12, fontWeight: 800}}>O(n)</div><div style={{fontSize: 66, marginTop: 27, fontWeight: 800}}>1,000,000</div><div style={{fontSize: 24, color: C.muted}}>possible checks</div></div>
      <div style={{flex: 1, background: '#143e4d', borderRadius: 20, padding: 30, border: `2px solid ${C.cyan}`, opacity: interpolate(f, [25, 65], [0.2, 1], clamp)}}><div style={{fontSize: 35, color: C.cyan}}>Binary search</div><div style={{fontSize: 51, marginTop: 12, fontWeight: 800}}>O(log n)</div><div style={{fontSize: 66, marginTop: 27, fontWeight: 800, color: C.green}}>20</div><div style={{fontSize: 24, color: C.muted}}>at most, when sorted</div></div>
    </div>
  </Scene>;
};

const Recap: React.FC = () => <Scene label="The algorithm in three steps" duration={300}>
  <Title>Sort → check middle → halve</Title>
  <div style={{fontSize: 39, color: C.muted, marginTop: 58}}>Repeat until found or the range is empty.</div>
  <div style={{fontSize: 45, color: C.green, fontWeight: 800, marginTop: 70}}>Fast search: O(log n)</div>
</Scene>;

export const BinarySearchExtended: React.FC = () => <AbsoluteFill style={{backgroundColor: C.bg}}>
  <Sequence from={0} durationInFrames={300}><Opening /><Audio src={staticFile('ext-01-question.wav')} /></Sequence>
  <Sequence from={300} durationInFrames={450}><Linear /><Audio src={staticFile('ext-02-linear.wav')} /></Sequence>
  <Sequence from={750} durationInFrames={450}><Sorted /><Audio src={staticFile('ext-03-sorted.wav')} /></Sequence>
  <Sequence from={1200} durationInFrames={240}><Search step="setup" duration={240} /><Audio src={staticFile('ext-04-setup.wav')} /></Sequence>
  <Sequence from={1440} durationInFrames={360}><Search step="sixteen" duration={360} /><Audio src={staticFile('ext-05-sixteen.wav')} /></Sequence>
  <Sequence from={1800} durationInFrames={360}><Search step="thirtyEight" duration={360} /><Audio src={staticFile('ext-06-thirty-eight.wav')} /></Sequence>
  <Sequence from={2160} durationInFrames={240}><Search step="found" duration={240} /><Audio src={staticFile('ext-07-found.wav')} /></Sequence>
  <Sequence from={2400} durationInFrames={450}><Missing /><Audio src={staticFile('ext-08-missing.wav')} /></Sequence>
  <Sequence from={2850} durationInFrames={450}><Compare /><Audio src={staticFile('ext-09-compare.wav')} /></Sequence>
  <Sequence from={3300} durationInFrames={300}><Recap /><Audio src={staticFile('ext-10-recap.wav')} /></Sequence>
</AbsoluteFill>;
