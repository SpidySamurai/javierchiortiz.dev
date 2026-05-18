import { getLocale } from 'next-intl/server';

const content = {
  en: {
    title: 'Privacy Notice',
    updated: 'Last updated: May 2026',
    intro: 'This portfolio collects minimal, anonymous data to understand how visitors interact with the site. No cookies are used.',
    sections: [
      {
        heading: 'What data is collected',
        items: [
          'Page path, locale, and referrer — stored in our database.',
          'Approximate location (city and country) derived from your IP address via ip-api.com. The IP itself is not stored.',
          'Section interaction data (which sections you viewed and for how long) via PostHog.',
          'Anonymous session recordings (no personal information, all inputs masked) via PostHog.',
        ],
      },
      {
        heading: 'Purpose',
        body: 'All data is used solely to understand which sections of the portfolio capture attention and where visitors come from. It is never sold or shared for commercial purposes.',
      },
      {
        heading: 'Third-party processors',
        items: [
          'PostHog (posthog.com) — analytics and session recording.',
          'ip-api.com — IP-to-city/country geolocation.',
          'Supabase (supabase.com) — database hosting.',
        ],
      },
      {
        heading: 'Cookies',
        body: 'This site does not set any cookies. PostHog uses localStorage for anonymous session identification.',
      },
      {
        heading: 'Contact',
        body: 'Questions? Reach out at javierchiortiz@gmail.com.',
      },
    ],
  },
  es: {
    title: 'Aviso de Privacidad',
    updated: 'Última actualización: mayo 2026',
    intro: 'Este portafolio recopila datos mínimos y anónimos para entender cómo los visitantes interactúan con el sitio. No se utilizan cookies.',
    sections: [
      {
        heading: 'Datos que se recopilan',
        items: [
          'Ruta de página, idioma y referrer — almacenados en nuestra base de datos.',
          'Ubicación aproximada (ciudad y país) derivada de tu dirección IP a través de ip-api.com. La IP en sí no se almacena.',
          'Datos de interacción por sección (qué secciones viste y por cuánto tiempo) a través de PostHog.',
          'Grabaciones de sesión anónimas (sin información personal, todos los inputs enmascarados) a través de PostHog.',
        ],
      },
      {
        heading: 'Finalidad',
        body: 'Todos los datos se utilizan únicamente para entender qué secciones del portafolio captan la atención y de dónde provienen los visitantes. Nunca se venden ni se comparten con fines comerciales.',
      },
      {
        heading: 'Procesadores externos',
        items: [
          'PostHog (posthog.com) — analíticas y grabación de sesión.',
          'ip-api.com — geolocalización IP a ciudad/país.',
          'Supabase (supabase.com) — alojamiento de base de datos.',
        ],
      },
      {
        heading: 'Cookies',
        body: 'Este sitio no establece ninguna cookie. PostHog utiliza localStorage para identificación de sesión anónima.',
      },
      {
        heading: 'Contacto',
        body: 'Para cualquier duda: javierchiortiz@gmail.com.',
      },
    ],
  },
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const c = locale === 'es' ? content.es : content.en;

  return (
    <div style={{ padding: '3rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <h1
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '2rem', fontWeight: 800, color: 'var(--ds-on-surface)',
            marginBottom: '0.4rem', marginTop: 0,
          }}
        >
          {c.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.75rem', color: 'var(--ds-outline)', marginBottom: '2rem' }}>
          {c.updated}
        </p>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.92rem', color: 'var(--ds-on-surface-variant)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          {c.intro}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {c.sections.map((section) => (
            <div key={section.heading}>
              <h2
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '1rem', fontWeight: 700, color: 'var(--ds-on-surface)',
                  marginBottom: '0.6rem', marginTop: 0,
                }}
              >
                {section.heading}
              </h2>
              {'items' in section && section.items ? (
                <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {section.items.map((item) => (
                    <li key={item} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.88rem', color: 'var(--ds-on-surface-variant)', lineHeight: 1.6 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.88rem', color: 'var(--ds-on-surface-variant)', lineHeight: 1.6, margin: 0 }}>
                  {'body' in section ? section.body : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

