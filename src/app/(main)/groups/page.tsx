import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus, Lock, Globe, MessageCircle } from 'lucide-react';
import CreateGroupButton from '@/components/groups/CreateGroupButton';

export default async function GroupsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch user's groups
  const { data: memberships, error } = await supabase
    .from('group_members')
    .select(`
      id,
      role,
      joined_at,
      group:groups(
        id,
        name,
        description,
        is_private,
        created_at,
        creator:users!groups_creator_id_fkey(id, full_name, avatar_url)
      )
    `)
    .eq('user_id', session.user.id)
    .order('joined_at', { ascending: false });

  const groups = memberships?.map((m: any) => ({
    ...m.group,
    membershipRole: m.role,
  })) || [];

  // Get member counts for each group
  const groupsWithCounts = await Promise.all(
    groups.map(async (group: any) => {
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id);

      return {
        ...group,
        memberCount: count || 0,
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#111111] text-white font-['Inter',sans-serif] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              My Gangs 🦁
            </h1>
            <p className="text-[#999999]">
              "Nanba gang-oda saapadu discuss pannalam!" <span className="text-[#0009FF]">Mass chat groups! 💬</span>
            </p>
          </div>
          <CreateGroupButton />
        </div>

        {/* Groups Grid */}
        {groupsWithCounts.length === 0 ? (
          <div className="bg-[#1E1E1E] rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.5)] border border-[#333333] p-12 text-center">
            <div className="w-20 h-20 bg-[#0009FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-[#0009FF]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No Groups Yet da! 🤷
            </h2>
            <p className="text-[#999999] mb-2 max-w-md mx-auto">
              Create your first gang to start chatting with nanbas about food spots!
            </p>
            <p className="text-sm text-[#666666] mb-6">"Yaarudaiya group-la join aagalam?"</p>
            <CreateGroupButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupsWithCounts.map((group: any) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="bg-[#1E1E1E] rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.5)] border border-[#333333] hover:border-[#0009FF] transition-all p-6 hover:-translate-y-1"
              >
                {/* Group Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-sm text-[#999999] line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {group.is_private ? (
                      <div className="w-10 h-10 bg-[#0009FF]/20 rounded-full flex items-center justify-center">
                        <Lock size={20} className="text-[#0009FF]" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Globe size={20} className="text-green-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Group Stats */}
                <div className="flex items-center gap-4 text-sm text-[#999999] mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{group.memberCount} nanbas</span>
                  </div>
                  {group.membershipRole === 'admin' && (
                    <span className="px-2 py-1 bg-[#0009FF]/20 text-[#0009FF] text-xs font-medium rounded-full border border-[#0009FF]/30">
                      Boss 👑
                    </span>
                  )}
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#333333]">
                  <div className="w-6 h-6 rounded-full bg-[#0009FF] flex items-center justify-center text-white text-xs font-bold">
                    {group.creator?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs text-[#999999]">
                    Created by {group.creator?.full_name || 'Unknown'}
                  </span>
                </div>

                {/* Chat Button */}
                <div className="mt-4 pt-4 border-t border-[#333333]">
                  <div className="flex items-center gap-2 text-[#0009FF] font-medium text-sm">
                    <MessageCircle size={16} />
                    <span>Open Chat 💬</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Help Text */}
        {groupsWithCounts.length > 0 && (
          <div className="mt-8 bg-[#1E1E1E] border border-[#333333] rounded-2xl p-4">
            <p className="text-sm text-[#999999]">
              <strong className="text-[#0009FF]">💡 Vera Level Tip:</strong> Click on any gang to start chatting,
              view nanbas, and manage settings. <span className="text-white">Admins-ku full powers! 👑</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
