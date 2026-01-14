import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/channels/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/chats/$id"!</div>;
}
