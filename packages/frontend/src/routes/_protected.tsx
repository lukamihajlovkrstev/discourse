import {
  createFileRoute,
  redirect,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { sessionQuery } from '@/queries/auth';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export const Route = createFileRoute('/_protected')({
  beforeLoad: () => {
    if (Cookies.get('hint') !== 'true') {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: ProtectedComponent,
});

function ProtectedComponent() {
  const navigate = useNavigate();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: sessionQuery,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      Cookies.remove('hint', { domain: 'localhost', path: '/' });
      navigate({ to: '/login', replace: true });
    }
  }, [isLoading, isError, data, navigate]);

  return <Outlet />;
}
