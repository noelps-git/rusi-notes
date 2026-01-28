import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import GroupChatClient from '@/components/groups/GroupChatClient';

export default async function GroupChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  const resolvedParams = await params;
  const supabase = await createClient();

  // Check if user is a member of this group
  const { data: membership } = await supabase
    .from('group_members')
    .select('id, role')
    .eq('group_id', resolvedParams.id)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    notFound();
  }

  // Fetch group details
  const { data: groupData } = await supabase
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

  if (!groupData) {
    notFound();
  }

  // Transform creator from array to single object
  const group = {
    ...groupData,
    creator: Array.isArray(groupData.creator) ? groupData.creator[0] : groupData.creator,
  };

  // Fetch all members
  const { data: membersData } = await supabase
    .from('group_members')
    .select(`
      id,
      role,
      joined_at,
      user:users(id, full_name, avatar_url, email)
    `)
    .eq('group_id', resolvedParams.id)
    .order('joined_at', { ascending: true });

  // Transform user from array to single object
  const members = membersData?.map((member: any) => ({
    ...member,
    user: Array.isArray(member.user) ? member.user[0] : member.user,
  }));

  // Fetch initial messages
  const { data: messagesData } = await supabase
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

  // Transform sender from array to single object
  const initialMessages = messagesData?.map((message: any) => ({
    ...message,
    sender: Array.isArray(message.sender) ? message.sender[0] : message.sender,
  }));

  return (
    <GroupChatClient
      group={group}
      members={members || []}
      initialMessages={initialMessages || []}
      currentUserId={user.id}
      userRole={membership.role}
    />
  );
}
