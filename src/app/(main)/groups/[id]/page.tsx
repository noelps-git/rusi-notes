import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import GroupChatClient from '@/components/groups/GroupChatClient';

export default async function GroupChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const supabase = await createClient();

  // Check if user is a member of this group
  const { data: membership } = await supabase
    .from('group_members')
    .select('id, role')
    .eq('group_id', resolvedParams.id)
    .eq('user_id', session.user.id)
    .single();

  if (!membership) {
    notFound();
  }

  // Fetch group details
  const { data: group } = await supabase
    .from('groups')
    .select(`
      id,
      name,
      description,
      is_private,
      created_at,
      creator:users!groups_creator_id_fkey(id, full_name, avatar_url)
    `)
    .eq('id', resolvedParams.id)
    .single();

  if (!group) {
    notFound();
  }

  // Fetch all members
  const { data: members } = await supabase
    .from('group_members')
    .select(`
      id,
      role,
      joined_at,
      user:users(id, full_name, avatar_url, email)
    `)
    .eq('group_id', resolvedParams.id)
    .order('joined_at', { ascending: true });

  // Fetch initial messages
  const { data: initialMessages } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      message_type,
      metadata,
      created_at,
      sender:users(id, full_name, avatar_url)
    `)
    .eq('group_id', resolvedParams.id)
    .order('created_at', { ascending: true })
    .limit(100);

  return (
    <GroupChatClient
      group={group}
      members={members || []}
      initialMessages={initialMessages || []}
      currentUserId={session.user.id}
      userRole={membership.role}
    />
  );
}
