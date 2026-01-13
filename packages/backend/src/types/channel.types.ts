import { z } from 'zod';

export const createChannelSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
});

export const updateChannelSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
});

export const channelIdParamSchema = z.object({
  id: z.string().min(1, 'Channel ID is required'),
});
