import { SidebarLeft } from '@/components/sidebarleft';
import { SidebarRight } from '@/components/sidebarright';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SocketProvider } from '@/hooks/use-socket';
import { getChannels } from '@/queries/channels';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/channels')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: channels } = useQuery({
    queryKey: ['channels'],
    queryFn: getChannels,
  });

  const params = useParams({ strict: false });
  const id = params.id as string | undefined;
  const current = channels?.filter((channel) => channel.channel === id);

  return (
    <SocketProvider>
      <SidebarProvider>
        <SidebarLeft channels={channels} />
        <SidebarInset>
          <div className="flex flex-col h-svh overflow-hidden">
            <div className="flex flex-col h-full w-full">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className="flex flex-1 items-center gap-2">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="text-foreground font-normal">
                    {current && current[0]?.title}
                  </div>
                </div>
                <SidebarRight />
              </header>
              <div className="flex-1 min-h-0 overflow-hidden">
                <Outlet />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SocketProvider>
  );
}
