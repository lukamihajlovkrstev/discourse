import * as z from 'zod';

export const googleTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
  scope: z.string().optional(),
  refresh_token: z.string().optional(),
});

export type GoogleTokenResponse = z.infer<typeof googleTokenResponseSchema>;

export const googleUserInfoSchema = z.object({
  id: z.string(),
  email: z.email(),
  verified_email: z.boolean(),
  name: z.string(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.url().optional(),
});

export type GoogleUserInfo = z.infer<typeof googleUserInfoSchema>;

export const callbackQuerySchema = z.object({
  code: z.string(),
});

export type CallbackQuery = z.infer<typeof callbackQuerySchema>;

export interface Session {
  user: string;
  createdAt: Date;
  expiresAt: Date;
}
