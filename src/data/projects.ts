import type { DataProject } from '@/types';

const imgPath = '/utils/img/01b6c8e2-295f-494e-acd0-e71473ebf089.png';

export const projects: DataProject[] = [
  {
    id: 'lab2next',
    title: 'Lab2Next',
    imageUrl: '/utils/img/lab2next-screenshot.png', // Generated via script
    description: 'Official site for Lab2Next App. Showcases features, pricing packages, and system capabilities.',
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://lab2next.com/',
    repoUrl: null,
    category: 'featured',
    status: 'wip',
    isWork: true, // It sounds like a professional venture/MVP
  },
  {
    id: 'scandia-ecommerce',
    title: 'Scandia Manufacturing',
    imageUrl: '/utils/img/scandia-manufacturing-screenshot.png',
    description: 'E-commerce platform build with special focus on shopify sections, components and responsiveness.',
    stack: ['Shopify', 'HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://scandiamfg.com/',
    repoUrl: null,
    category: 'featured',
    status: 'complete',
    isWork: true,
    company: 'Scandia',
    companyUrl: 'https://scandiamfg.com/',
  },
  {
    id: 'saunas-com',
    title: 'Saunas.com',
    imageUrl: '/utils/img/saunas-screenshot.png', // Generated via script
    description: 'E-commerce platform for sauna and steam room products. Feature-rich implementation related to Scandia Mfg.',
    stack: ['Shopify', 'HTML', 'Liquid', 'JavaScript'],
    liveUrl: 'https://saunas.com/',
    repoUrl: null,
    category: 'featured',
    status: 'complete',
    isWork: true,
    company: 'Scandia',
    companyUrl: 'https://scandiamfg.com/',
  },
  {
    id: 'sun-valley-salt',
    title: 'Sun Valley Salt',
    imageUrl: '/utils/img/sunvalleysalt-screenshot.png', // Generated via script
    description: 'E-commerce platform for Himalayan salt wall panels. Manufacturing and customization focus.',
    stack: ['Shopify', 'HTML', 'Liquid', 'JavaScript'],
    liveUrl: 'https://sunvalleysalt.com/',
    repoUrl: null,
    category: 'featured',
    status: 'complete',
    isWork: true,
    company: 'Scandia',
    companyUrl: 'https://scandiamfg.com/',
  },

  {
    id: 'portfolio-personal',
    title: 'Portafolio Personal',
    imageUrl: '/utils/img/portfolio-personal-live-screenshot.png',
    description: 'Sitio personal para mostrar mi experiencia y proyectos recientes.',
    stack: ['Next', 'Tailwind', 'TypeScript'],
    liveUrl: 'https://javierchiortiz.dev',
    repoUrl: 'https://github.com/SpidySamurai/web-portfolio2025',
    category: 'featured',
    status: 'complete',
    isWork: true,
  },
  {
    id: 'wallet-app',
    title: 'Wallet App',
    imageUrl: imgPath,
    description:
      'Aplicación de billetera con autenticación, enviar, recibir y manejo de transacciones.',
    stack: ['Next', 'Tailwind', 'TypeScript', 'React'],
    projectUrl: 'https://miwallet.com',
    liveUrl: null,
    repoUrl: 'https://github.com/SpidySamurai/wallet-app',
    category: 'featured',
    status: 'wip',
    hidden: true, // ocultada según petición
  },

  // Entry-level / pinned repos
  {
    id: 'spa-rick-and-morty',
    title: 'SPA Rick and Morty',
    imageUrl: '/utils/img/spa-rick-and-morty-screenshot.png',
    description: 'SPA de práctica consumiendo la API de Rick & Morty.',
    stack: ['JavaScript', 'Webpack', 'HTML', 'CSS'],
    liveUrl: 'https://spidysamurai.github.io/SPA_rick_and_morty/',
    repoUrl: 'https://github.com/SpidySamurai/SPA_rick_and_morty',
    category: 'entry',
    status: 'complete',
  },
  {
    id: 'kittys-api-consuming',
    title: "Kittys API Consuming",
    imageUrl: '/utils/img/kittys-api-consuming-screenshot.png',
    description: 'Ejercicio de consumo de APIs con paginación y filtros.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://spidysamurai.github.io/Kittys_api_consuming/',
    repoUrl: 'https://github.com/SpidySamurai/Kittys_api_consuming',
    category: 'entry',
    status: 'complete',
  },
  {
    id: 'batata-bit',
    title: 'Batata-bit',
    imageUrl: '/utils/img/batata-bit-screenshot.png',
    description: "Landing responsive enfocada en diseño mobile-first.",
    stack: ['HTML', 'CSS'],
    liveUrl: 'https://spidysamurai.github.io/Batata-bit/',
    repoUrl: 'https://github.com/SpidySamurai/Batata-bit',
    category: 'entry',
    status: 'complete',
  },
];
