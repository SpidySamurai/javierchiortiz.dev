/** The services the hero cycles through, as message keys under `common`. */
export const HERO_SERVICES = [
  { label: 'hero_svc_agents', sub: 'hero_svc_agents_sub' },
  { label: 'hero_svc_rag', sub: 'hero_svc_rag_sub' },
  { label: 'hero_svc_evals', sub: 'hero_svc_evals_sub' },
  { label: 'hero_svc_automations', sub: 'hero_svc_automations_sub' },
  { label: 'hero_svc_saas', sub: 'hero_svc_saas_sub' },
  { label: 'hero_svc_webapps', sub: 'hero_svc_webapps_sub' },
] as const;

/** Easter egg caption: a lyric, so it stays English in every locale. */
export const EGG_LYRIC = 'sometimes quiet is violent';
