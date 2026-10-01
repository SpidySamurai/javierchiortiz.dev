export type Stage = 'plan' | 'build' | 'launch';
export const STAGES: readonly Stage[] = ['plan', 'build', 'launch'];

export const STAGE_ICONS: Record<Stage, string> = {
  plan: 'architecture',
  build: 'construction',
  launch: 'rocket_launch',
};
