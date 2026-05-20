interface TechCategory {
  label: string;
  items: string[];
}

const CATEGORIES: TechCategory[] = [
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML & CSS'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Python', 'Django', 'SQL Server', 'Apache Spark', 'Scala'],
  },
  {
    label: 'Ecosystem',
    items: ['Shopify / Liquid', 'Git', 'REST APIs', 'Webpack', 'SASS', '.NET'],
  },
];

function TechItem({ name }: { name: string }) {
  return (
    <div
      className="flex items-center gap-3 py-2.5 border-b"
      style={{ borderColor: 'var(--ds-outline-variant)' }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: 'var(--ds-primary)' }}
      />
      <span
        className="text-sm"
        style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {name}
      </span>
    </div>
  );
}

function CategoryGroup({ label, items }: TechCategory) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.25em] font-bold mb-4"
        style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label}
      </p>
      <div>
        {items.map((name) => (
          <TechItem key={name} name={name} />
        ))}
      </div>
    </div>
  );
}

export default function Stack() {
  return (
    <section
      id="stack"
      className="py-28 px-8 lg:px-20"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-16">
        <div>
          <p
            className="text-xs uppercase tracking-[0.3em] font-bold mb-4"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Arsenal
          </p>
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Tech <em>Stack</em>
          </h2>
        </div>
        <p
          className="text-sm uppercase tracking-widest hidden md:block"
          style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Current · Growing
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {CATEGORIES.map((cat) => (
          <CategoryGroup key={cat.label} label={cat.label} items={cat.items} />
        ))}
      </div>
    </section>
  );
}
