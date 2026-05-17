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
      style={{ borderColor: 'rgba(70,69,84,0.2)' }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: '#c0c1ff' }}
      />
      <span
        className="text-sm"
        style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
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
        style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
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
      style={{ backgroundColor: '#131b2e', scrollMarginTop: '5rem' }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-16">
        <div>
          <p
            className="text-xs uppercase tracking-[0.3em] font-bold mb-4"
            style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Arsenal
          </p>
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
            style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Tech <em>Stack</em>
          </h2>
        </div>
        <p
          className="text-sm uppercase tracking-widest hidden md:block"
          style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
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
