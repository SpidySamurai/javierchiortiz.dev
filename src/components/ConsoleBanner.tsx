'use client';

import { useEffect } from 'react';

const ASCII = `
     ██╗ ██████╗  ██████╗
     ██║██╔════╝ ██╔═══██╗
     ██║██║      ██║   ██║
██   ██║██║      ██║   ██║
╚█████╔╝╚██████╗ ╚██████╔╝
 ╚════╝  ╚═════╝  ╚═════╝

  Javier Chi Ortiz
  Full-Stack Developer
  https://javierchiortiz.dev
`;

const WARNING = `
  [!] SECURITY NOTICE
  ───────────────────────────────────────────────
  This site monitors DevTools activity.
  Any attempt to execute code, intercept requests,
  or tamper with the application is logged.
  ───────────────────────────────────────────────
`;

export default function ConsoleBanner() {
  useEffect(() => {
    console.log('%c' + ASCII, 'color:#c0c1ff;font-family:monospace;font-size:11px;line-height:1.4;');
    console.log('%c' + WARNING, 'color:#ef4444;font-family:monospace;font-size:11px;line-height:1.6;');
  }, []);

  return null;
}
