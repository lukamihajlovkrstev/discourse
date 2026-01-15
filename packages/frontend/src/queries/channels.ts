import { api } from '@/lib/api-client';
import type {
  Channel,
  CreateChannelInput,
  Member,
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
