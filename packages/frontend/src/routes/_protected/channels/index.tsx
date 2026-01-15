import { getChannels } from '@/queries/channels';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/channels/')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const channels = await queryClient.ensureQueryData({
      queryKey: ['channels'],
      queryFn: getChannels,
    });

    if (channels.length > 0) {
      const latestChannel = channels.sort(
        (a, b) =>
          new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime(),
      )[0];

      throw redirect({
        to: '/channels/$id',
        params: { id: latestChannel.channel },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
