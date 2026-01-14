import { z } from 'zod';

export const channelIdParamSchema = z.object({
  id: z.string().min(1, 'Channel ID is required'),
});
