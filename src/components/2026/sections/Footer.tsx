export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="py-20 px-8 md:px-16 border-t"
      style={{
        backgroundColor: '#0b1326',
        borderColor: 'rgba(70,69,84,0.10)',
        scrollMarginTop: '5rem',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        {/* Identity */}
        <div className="text-center md:text-left">
          <h2
            className="text-3xl font-extrabold mb-2"
            style={{ color: '#ffffff', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Javier Chi Ortíz
          </h2>
          <p style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}>
            Available for collaborations
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          <a
            href="mailto:javier@javierchiortiz.dev"
            className="text-xs font-bold uppercase tracking-widest transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
          >
            Email
          </a>
          <a
            href="https://linkedin.com/in/javierchiortiz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/javierchiortiz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
          >
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <p
          className="text-[10px] uppercase tracking-widest"
          style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          © {year} Javier Chi Ortíz
        </p>
      </div>
    </footer>
  );
}
