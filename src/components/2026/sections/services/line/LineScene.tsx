import { useId, type CSSProperties } from 'react';
import { AndonBoard } from './AndonBoard';
import { Backdrop, Pedestal } from './Backdrop';
import { Belt } from './Belt';
import { Blueprint } from './Blueprint';
import { DraftArm, GantryBeam, GantryFx, GantryLegs } from './Gantry';
import { ForegroundColumn } from './ForegroundColumn';
import { LaunchFx, LivePulses, SeparationRing } from './LaunchFx';
import { LaunchTower, Umbilical } from './LaunchTower';
import { OrbitBack, OrbitFront } from './OrbitMarks';
import { Piece } from './Piece';
import { SceneDefs, SceneIdProvider } from './SceneDefs';
import { UpdateOutlines, UpdatePassMark, UpdateWorld } from './UpdatePass';
import { PIV, PIV2, K2, VIEW_H, VIEW_W } from './geometry';
import type { Labels } from './bind';

/**
 * The scene, composed from small presentational parts in painting order. Static React:
 * every animated attribute is declared with `data-bind` and written by the line driver
 * from `lineFrame`, so none of this re-renders per frame. Colors are DS and scene tokens
 * (`--ds-scene-*`, defined for both themes in globals.css); gradient ids are unique per instance.
 */

interface SceneProps {
  /** Static scene text (step names, deployed), already translated. */
  copy: Labels;
  /** viewBox to show. Mobile and reduced motion crop around one station. */
  viewBox?: string;
  className?: string;
}

export default function LineScene({ copy, viewBox = `0 0 ${VIEW_W} ${VIEW_H}`, className }: SceneProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [, , w, h] = viewBox.split(' ').map(Number);
  const style = { display: 'block', width: '100%', height: 'auto', aspectRatio: `${w} / ${h}`, opacity: 0, borderRadius: 12 } as CSSProperties;
  return (
    <svg aria-hidden viewBox={viewBox} className={className} style={style} data-bind="s.opacity:ready" overflow="hidden">
      <SceneIdProvider value={id}>
        <SceneDefs id={id} />
        <g data-bind="transform:shake">
          <Backdrop />
          <Pedestal />
          <LaunchTower />
          <AndonBoard copy={copy} />
          <Belt />
          <LaunchFx />
          <Umbilical />
          <Blueprint />
          <GantryLegs />
          <LivePulses />
          <OrbitBack />
          <Piece />
          <SeparationRing />
          <UpdateWorld />
          <UpdateOutlines />
          <UpdatePassMark />
          <GantryBeam />
          <GantryFx />
          <DraftArm id="a1" piv={PIV} k={1} />
          <ForegroundColumn />
          <DraftArm id="a2" piv={PIV2} k={K2} fg />
          <OrbitFront copy={copy} />
        </g>
      </SceneIdProvider>
    </svg>
  );
}
