export type Project = {
  title: string;
  imageUrl: string;
  description: string;
  stack: string[];
  projectUrl?: string;
};

const imgPath = '/utils/img/01b6c8e2-295f-494e-acd0-e71473ebf089.png';

export const projects: Project[] = [
  {
    title: 'Wallet App',
    imageUrl: imgPath,
    description: 'Aplicación de billetera con autenticación, gráficos y manejo de transacciones.',
    stack: ['Next', 'Tailwind', 'TypeScript', 'React'],
    projectUrl: 'https://miwallet.com',
  },
  {
    title: 'Portafolio Personal',
    imageUrl: imgPath,
    description: 'Sitio personal para mostrar mi experiencia y proyectos recientes.',
    stack: ['Next', 'Tailwind', 'TypeScript'],
  },
];
