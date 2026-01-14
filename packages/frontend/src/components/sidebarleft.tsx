import { EditIcon, Loader2, LogOut, Plus, Search } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUser } from '@/queries/auth';
import { getInitials } from '@/lib/utils';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import type { Channel } from '@discourse/shared';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { createChannel, updateChannel } from '@/queries/channels';
import { queryClient } from '@/lib/query-client';

export function SidebarLeft({ channels }: { channels?: Channel[] }) {
  const [title, setTitle] = useState<string>('');
  const [target, setTarget] = useState<null | string>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const id = params.id as string | undefined;

  const { data: user } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getUser,
  });

  const filtered = useMemo(() => {
    if (!channels) return [];

    return channels.filter((channel) =>
      channel.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, channels]);

  const createMutation = useMutation({
    mutationFn: createChannel,
    onSuccess: (channel) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setOpen(false);
      navigate({
        to: '/channels/$id',
        params: { id: channel.channel },
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setOpen(false);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isPending) return;

    if (target) {
      updateMutation.mutate({
        id: target,
        data: { title },
      });
    } else {
      createMutation.mutate({ title });
    }
  };

  return (
    <Sidebar className="border-r-0">
      <Dialog open={open} onOpenChange={(val) => !isPending && setOpen(val)}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>
                {target ? 'Rename collection' : 'Name your collection'}
              </DialogTitle>
              <DialogDescription>
                This title will be used to organize and group all responses.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="form-title">Title</Label>
                <Input
                  id="form-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  disabled={isPending}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending || !title!.trim()}
                className="min-w-25"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : target ? (
                  'Save changes'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SidebarHeader>
        <div className="flex gap-2 align-middle my-2">
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center">
            <img src="/icon.svg" alt="Logo" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Discourse Inc</span>
            <span className="truncate text-xs">Team communications</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="py-1">
          <SidebarGroupContent className="flex gap-1 justify-between">
            <div className="relative w-full">
              <SidebarInput
                placeholder="Search channels..."
                className="pl-8"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50" />
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => {
                setTarget(null);
                setTitle('');
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filtered?.map((channel) => (
                <SidebarMenuItem key={channel.channel}>
                  <SidebarMenuButton
                    isActive={channel.channel === id}
                    className="gap-1"
                    onClick={() => {
                      navigate({
                        to: '/channels/$id',
                        params: { id: channel.channel },
                      });
                    }}
                  >
                    {channel.is_owner && (
                      <span className="truncate">
                        <img src="/star.svg" alt="owner" />
                      </span>
                    )}
                    <span className="truncate">{channel.title}</span>
                  </SidebarMenuButton>
                  {channel.is_owner && (
                    <SidebarMenuAction
                      showOnHover
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTarget(channel.channel);
                        setTitle(channel.title);
                        setOpen(true);
                      }}
                    >
                      <EditIcon className="size-4" />
                    </SidebarMenuAction>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between items-center p-1 py-1.5">
          <div className="flex gap-2 items-center min-w-0">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="rounded-lg">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight truncate">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs opacity-70">{user?.email}</span>
            </div>
          </div>
          <Button size="icon-sm" variant="outline">
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
