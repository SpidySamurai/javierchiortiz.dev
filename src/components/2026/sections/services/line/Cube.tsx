import type { ReactNode } from 'react';
import type { BoxFaces, CubeKind } from './cubes';
import { Band, SideFace, TopFace } from './FaceUI';
import { useTone } from './SceneDefs';

/** Keys a cube follows: transform, opacity and the boot-up (lit screens) opacity. */
export interface CubeBind {
  tf: string;
  op: string;
  lit: string;
}

interface CubeProps {
  faces: BoxFaces;
  kind: CubeKind;
  bind: CubeBind;
  children?: ReactNode;
}

const BAND_FIT = ' translate(0 8) scale(1 .9)';

function Edge({ p, o, w }: { p: readonly [readonly [number, number], readonly [number, number]]; o: number; w: number }) {
  return <line x1={p[0][0]} y1={p[0][1]} x2={p[1][0]} y2={p[1][1]} stroke="white" strokeOpacity={o} strokeWidth={w} strokeLinecap="round" />;
}

/** One iso module: three shaded faces, interface on each, highlights on the edges. */
export default function Cube({ faces: F, kind, bind, children }: CubeProps) {
  const tone = useTone(kind.tone);
  const face = { stroke: tone.edge, strokeOpacity: 0.55, strokeLinejoin: 'round' as const };
  const fit = kind.band ? BAND_FIT : '';
  return (
    <g opacity={0} data-bind={`transform:${bind.tf},opacity:${bind.op}`}>
      <polygon points={F.top} fill={tone.top} {...face} />
      <polygon points={F.right} fill={tone.right} {...face} />
      <polygon points={F.left} fill={tone.left} {...face} />
      <g transform={F.mTop}>
        <TopFace kind={kind.t} litKey={bind.lit} />
      </g>
      {kind.band && (
        <>
          <g transform={F.mRight}><Band /></g>
          <g transform={F.mLeft}><Band /></g>
        </>
      )}
      <g transform={F.mRight + fit}>
        <SideFace kind={kind.r} litKey={bind.lit} />
      </g>
      <g transform={F.mLeft + fit}>
        <SideFace kind={kind.l} litKey={bind.lit} />
      </g>
      <Edge p={F.eR} o={0.6} w={1.3} />
      <Edge p={F.eL} o={0.42} w={1.3} />
      <Edge p={F.eV} o={0.28} w={1.2} />
      {children}
    </g>
  );
}
