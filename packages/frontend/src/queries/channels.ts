import { api } from '@/lib/api-client';
import type {
  Channel,
  CreateChannelInput,
  Member,
  PaginatedMessages,
  UpdateChannelInput,
} from '@discourse/shared';

export async function getChannels(): Promise<Channel[]> {
  return api('/channels');
}

export async function getMembers({
  channel,
}: {
  channel: string;
}): Promise<Member[]> {
  return api(`/channels/${channel}`);
}

export async function createChannel(
  data: CreateChannelInput,
): Promise<Channel> {
  return api('/channels', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateChannel({
  id,
  data,
}: {
  id: string;
  data: UpdateChannelInput;
}): Promise<Channel> {
  return api(`/channels/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function getMessages(
  channel: string,
  cursor?: string,
  limit: number = 10,
): Promise<PaginatedMessages> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (cursor) {
    params.append('cursor', cursor);
  }

  return api(`/channels/${channel}/messages?${params.toString()}`);
}
