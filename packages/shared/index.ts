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
  email: string;
  joined_at: Date;
  is_owner: boolean;
  online: boolean;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
}

export type WebSocketMessages =
  | { type: 'status'; payload: Status }
  | { type: 'message'; payload: Message };

export interface Status {
  user: string;
  online: boolean;
}

export interface Message {
  channel: string;
  message: string;
  user: string;
  name: string;
  picture: string;
  content: string;
}

export const messageCreateSchema = z.object({
  content: z.string().min(1, 'Content is required').trim(),
  channel: z.string().min(1, 'Channel is required'),
});

export type MessageCreate = z.infer<typeof messageCreateSchema>;

export const messagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.iso.datetime().optional(),
});

export type MessagesQuery = z.infer<typeof messagesQuerySchema>;

export interface PaginatedMessages {
  messages: Message[];
  next: string | null;
  more: boolean;
}

export interface WebSocketEvents {
  status: Status;
  message: Message;
}

export type WebSocketEventType = keyof WebSocketEvents;
export type WebSocketEventPayload<T extends WebSocketEventType> =
  WebSocketEvents[T];
