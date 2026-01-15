import { z } from 'zod';

export const createChannelSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
});

export type CreateChannelInput = z.infer<typeof createChannelSchema>;

export const updateChannelSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
});

export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Channel {
  channel: string;
  title: string;
  joined_at: Date;
  is_owner: boolean;
}

export interface Member {
  user: string;
  name: string;
  picture: string | null;
  joined_at: Date;
  is_owner: boolean;
  online: boolean;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
}

export type WebSocketMessages = { type: 'status'; payload: Status };

export interface Status {
  user: string;
  online: boolean;
}

export interface WebSocketEvents {
  status: Status;
}

export type WebSocketEventType = keyof WebSocketEvents;
export type WebSocketEventPayload<T extends WebSocketEventType> =
  WebSocketEvents[T];
