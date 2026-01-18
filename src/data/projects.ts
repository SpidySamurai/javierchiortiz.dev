import type { DataProject } from '@/types';

const imgPath = '/utils/img/01b6c8e2-295f-494e-acd0-e71473ebf089.png';

export const projects: DataProject[] = [
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
    id: 'portfolio-personal',
    title: 'Portafolio Personal',
    imageUrl: '/utils/img/portfolio-personal-live-screenshot.png',
    description: 'Sitio personal para mostrar mi experiencia y proyectos recientes.',
    stack: ['Next', 'Tailwind', 'TypeScript'],
    liveUrl: 'https://javierchiortiz.dev',
    repoUrl: 'https://github.com/SpidySamurai/web-portfolio2025',
    category: 'featured',
    status: 'complete',
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
    stack: ['JavaScript'],
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
    stack: ['JavaScript'],
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
