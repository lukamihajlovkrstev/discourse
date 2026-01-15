import { api } from '@/lib/api-client';
import type { User } from '@discourse/shared';

export async function getUser(): Promise<User> {
  return api('/auth/me');
}

export async function logOut() {
  return api('/auth/logout', { method: 'GET' });
}
