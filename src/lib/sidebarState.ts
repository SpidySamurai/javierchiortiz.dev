import { cookies } from 'next/headers';

export async function getSidebarCollapsed(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('sidebar-collapsed')?.value === 'true';
}
