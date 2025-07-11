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
            'Build and maintain scalable UI interfaces for data-heavy applications, enabling internal teams and external clients to access dynamic dashboards and tools. Lead the development of a responsive multi-page portal and collaborate with backend engineers to integrate secure APIs and optimize user workflows. Currently building a mobile-first e-wallet web app focused on real-time account and transaction views with secure session management.',
        stack: [...FRONTEND, ...WEB, ...DATA, 'Superset', 'SQL', 'Django', 'Python'],
    },
    {
        title: 'Frontend Support Dev at Softtek',
        date: 'Jun 2021 - Dec 2022',
        description: 'Delivered application maintenance support by migrating pages, troubleshooting issues, and implementing solutions through collaborative work with developers and QA. Contributed to system improvements and ensured seamless operation through testing, user communication, and backend data adjustments.'
        ,
        stack: [...FRONTEND, ...BACKEND, ...WEB]
    },
    {
        title: 'FrontEnd at Scandia',
        date: 'Jun 2021 - Dec 2022',
        description: 'Implemented and refined e-commerce interfaces focused on performance, SEO, and responsiveness. Collaborated with a semi senior UI/UX developer and the marketing team to bring design visions to life, customize storefronts, and enhance the customer experience through interactive features and optimized layouts.'
        ,
        stack: [...FRONTEND, ...WEB, 'Shopify']
    },
    {
        title: 'FrontEnd at IOTAM',
        date: 'Jun 2021 - Dec 2022',
        description: 'Refactored and improved the responsiveness of key application components. Collaborated with backend developers to ensure reliable data flow from meters, while supporting data visualization and enhancing the overall interface in coordination with the design team.'
        ,
        stack: ['React', 'SASS', ...WEB]
    },
    {
        title: 'FrontEnd Intership at BrightCoders ',
        date: 'Jun 2021 - Dec 2022',
        description: 'Participated in a collaborative internship program solving coding challenges and iterating on solutions in small teams. Built web pages based on provided designs and contributed to a final multi-feature project, applying skills developed throughout the program.'
        ,
        stack: [...WEB, 'ROR', 'Ruby']
    },
];
