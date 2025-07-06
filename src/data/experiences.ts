export type Experience = {
    title: string;
    date: string;
    description: string;
    stack: string[];
};

const WEB = ['JS', 'HTML', 'CSS'];
const FRONTEND = ['Next', 'React', 'TypeScript'];
const BACKEND = ['DotNet', 'CSharp', 'SQL'];
const DATA = ['Scala', 'Spark'];
// const FULLSTACK = [...WEB, ...FRONTEND, ...BACKEND];

export const experiences: Experience[] = [
    {
        title: 'Frontend Developer at ENTI',
        date: 'Aug 2023 - Present',
        description:
            'Construcción de interfaces con Next.js y Tailwind. Implementación de autenticación, formularios dinámicos y despliegue continuo en Vercel.',
        stack: [...FRONTEND, ...WEB, ...DATA, 'Superset', 'SQL', 'Django', 'Python'],
    },
    {
        title: 'Frontend Support Dev at Softtek',
        date: 'Jun 2021 - Dec 2022',
        description: 'Diseño de interfaces para dashboards y sistemas administrativos. Uso intensivo de Figma y colaboración en equipos ágiles.',
        stack: [...FRONTEND, ...BACKEND, ...WEB]
    },
    {
        title: 'FrontEnd at Scandia',
        date: 'Jun 2021 - Dec 2022',
        description: 'Diseño de interfaces para dashboards y sistemas administrativos. Uso intensivo de Figma y colaboración en equipos ágiles.',
        stack: [...FRONTEND, ...WEB, 'Shopify']
    },
    {
        title: 'FrontEnd at IOTAM',
        date: 'Jun 2021 - Dec 2022',
        description: 'Diseño de interfaces para dashboards y sistemas administrativos. Uso intensivo de Figma y colaboración en equipos ágiles.',
        stack: ['React', 'SASS', ...WEB]
    },
    {
        title: 'FrontEnd Intership at BrightCoders ',
        date: 'Jun 2021 - Dec 2022',
        description: 'Diseño de interfaces para dashboards y sistemas administrativos. Uso intensivo de Figma y colaboración en equipos ágiles.',
        stack: [...WEB, 'ROR', 'Ruby']
    },
];
