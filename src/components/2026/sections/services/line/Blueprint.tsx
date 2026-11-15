import { AXES_D, AXES_LEN, CIRCLE_D, CIRCLE_LEN, DIMS_D, DIMS_LEN } from './cubes';
import { P, PY } from './geometry';

/** Blueprint the drafting arm draws at the plan station: circle, axes and dimension marks, each with a soft halo. */

const STROKES = [
  { d: CIRCLE_D, len: CIRCLE_LEN, color: 'var(--ds-primary-container)', w: 1.3, key: 'circle' },
  { d: AXES_D, len: AXES_LEN, color: 'var(--ds-primary-container)', w: 1, key: 'axes' },
  { d: DIMS_D, len: DIMS_LEN, color: 'var(--ds-primary)', w: 1.3, key: 'dims' },
] as const;

export function Blueprint() {
  return (
    <g transform={`translate(${P} ${PY})`} data-bind="opacity:bp.op">
      {STROKES.map((st, i) => (
        <g key={st.key}>
          <path d={st.d} fill="none" stroke={st.color} strokeWidth={st.w * 4} opacity={0} style={{ filter: 'blur(3px)' }} data-bind={`opacity:bp.h${i}`} />
          <path d={st.d} fill="none" stroke={st.color} strokeWidth={st.w} strokeDasharray={`${st.len} ${st.len}`} strokeDashoffset={st.len} data-bind={`stroke-dashoffset:bp.${st.key}Off`} />
        </g>
      ))}
    </g>
  );
}
