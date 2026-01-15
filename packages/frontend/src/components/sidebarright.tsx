import { Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { AvatarFallback } from './ui/avatar';
import type { Member } from '@discourse/shared';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '@/queries/channels';
import { useParams } from '@tanstack/react-router';
import { getInitials } from '@/lib/utils';
import { useSocket } from '@/hooks/use-socket';
import { queryClient } from '@/lib/query-client';
import { useEffect } from 'react';

export function SidebarRight() {
  const params = useParams({ strict: false });
  const channel = params.id as string | undefined;
  const { socket } = useSocket();

  const { data: members } = useQuery<Member[]>({
    queryKey: ['members', channel],
    queryFn: () => getMembers({ channel: channel as string }),
    enabled: !!channel,
  });

  useEffect(() => {
    if (!socket) return;

    const handleStatus = (payload: { user: string; online: boolean }) => {
      queryClient.setQueryData<Member[]>(['members', channel], (old) => {
        if (!old) return old;

        return old.map((member) =>
          member.user === payload.user
            ? { ...member, online: payload.online }
            : member,
        );
      });
    };

    socket.on('status', handleStatus);

    return () => {
      socket.off('status', handleStatus);
    };
  }, [socket, channel, queryClient]);

  const online = members?.filter((member) => member.online);
  const offline = members?.filter((member) => !member.online);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="mr-2">
          <Users className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Members</SheetTitle>
        </SheetHeader>
        {online?.length !== 0 && (
          <div className="px-4 flex flex-col">
            <div className="pl-0.5 text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md text-xs font-medium">
              Online ({online?.length})
            </div>
            <div className="flex flex-col gap-4">
              {online?.map((member) => (
                <div className="flex align-middle justify-between">
                  <div
                    className="flex gap-2 items-center min-w-0"
                    key={member.user}
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={member.picture as string | undefined}
                        alt={member.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight truncate">
                      <span className="truncate font-medium">
                        {member.name}
                      </span>
                      <span className="truncate text-xs opacity-70">
                        arrianaire@gmail.com
                      </span>
                    </div>
                  </div>
                  <div className="flex align-middle">
                    {member.is_owner && (
                      <img
                        src="/star.svg"
                        alt="owner"
                        width="16px"
                        height="16px"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {offline?.length !== 0 && (
          <div className="px-4 pt-8 flex flex-col">
            <div className="pl-0.5 text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md text-xs font-medium">
              Offline ({offline?.length})
            </div>
            <div className="flex flex-col gap-4">
              {offline?.map((member) => (
                <div
                  className="flex gap-2 items-center min-w-0"
                  key={member.user}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={member.picture as string | undefined}
                      alt={member.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight truncate">
                    <span className="truncate font-medium">{member.name}</span>
                    <span className="truncate text-xs opacity-70">
                      arrianaire@gmail.com
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
