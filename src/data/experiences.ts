import type { DataExperience } from '@/types';

const WEB = ['JS', 'HTML', 'CSS'];
const FRONTEND = ['Next', 'React', 'TypeScript'];
const BACKEND = ['DotNet', 'CSharp', 'SQL'];
const DATA = ['Scala', 'Spark'];
// const FULLSTACK = [...WEB, ...FRONTEND, ...BACKEND];

export const experiences: DataExperience[] = [
  {
    id: 'enti',
    title: 'Full Stack Developer at ENTI',
    date: 'Aug 2023 - Present',
    description:
      'Build and maintain scalable UI interfaces for data-heavy applications, enabling internal teams and external clients to access dynamic dashboards and tools. Lead the development of a responsive multi-page portal and collaborate with backend engineers to integrate secure APIs and optimize user workflows. Currently building a mobile-first e-wallet web app focused on real-time account and transaction views with secure session management.',
    stack: [...FRONTEND, ...WEB, ...DATA, 'Superset', 'SQL', 'Django', 'Python'],
    url: 'https://enti.mx/',
  },
  {
    id: 'softtek',
    title: 'Full Stack Developer at Softtek',
    date: 'Jun 2022 - Mar 2024',
    description:
      'Delivered application maintenance support by migrating pages, troubleshooting issues, and implementing solutions through collaborative work with developers and QA. Contributed to system improvements and ensured seamless operation through testing, user communication, and backend data adjustments.',
    stack: [...FRONTEND, ...BACKEND, ...WEB],
    url: 'https://www.softtek.com/',
  },
  {
    id: 'scandia',
    title: 'FrontEnd at Scandia',
    date: 'Jan 2020 - Jun 2022',
    description:
      'Implemented and refined e-commerce interfaces focused on performance, SEO, and responsiveness. Collaborated with a semi senior UI/UX developer and the marketing team to bring design visions to life, customize storefronts, and enhance the customer experience through interactive features and optimized layouts.',
    stack: [...FRONTEND, ...WEB, 'Shopify'],
    url: 'https://www.linkedin.com/company/scandia-manufacturing/people/?viewAsMember=true',
  },
  {
    id: 'iotam',
    title: 'FrontEnd at IOTAM',
    date: 'Jul 2021 - Dec 2021',
    description:
      'Refactored and improved the responsiveness of key application components. Collaborated with backend developers to ensure reliable data flow from meters, while supporting data visualization and enhancing the overall interface in coordination with the design team.',
    stack: ['React', 'SASS', ...WEB],
    url: 'https://iotam.com.mx/',
  },
  {
    id: 'brightcoders',
    title: 'FrontEnd Internship at BrightCoders ',
    date: 'Feb 2021 - Jul 2021',
    description:
      'Participated in a collaborative internship program solving coding challenges and iterating on solutions in small teams. Built web pages based on provided designs and contributed to a final multi-feature project, applying skills developed throughout the program.',
    stack: [...WEB, 'ROR', 'Ruby'],
    url: 'https://www.brightcoders.com/',
  },
];
