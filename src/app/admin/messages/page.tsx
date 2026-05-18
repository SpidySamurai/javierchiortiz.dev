import { createClient } from '@/lib/supabase/server';
import MessageList from '@/app/admin/_components/MessageList';

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return <MessageList initialMessages={messages ?? []} />;
}
