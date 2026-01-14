import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { sessionQuery } from '@/queries/auth';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export const Route = createFileRoute('/_guest')({
  beforeLoad: () => {
    if (Cookies.get('hint') === 'true') {
      throw redirect({
        to: '/chats',
      });
    }
  },
  component: GuestComponent,
});

function GuestComponent() {
  const navigate = useNavigate();
  const hasHint = Cookies.get('hint') === 'true';

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: sessionQuery,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: hasHint,
  });

  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      navigate({ to: '/chats', replace: true });
    }
  }, [isLoading, isSuccess, data, navigate]);

  return <Outlet />;
}
