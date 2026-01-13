import {
  googleTokenResponseSchema,
  googleUserInfoSchema,
  GoogleTokenResponse,
  GoogleUserInfo,
} from '../types/auth.types';

export class AuthService {
  private readonly GOOGLE_AUTH_URL =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly GOOGLE_USERINFO_URL =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${this.GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });

    const response = await fetch(this.GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error response:', error);
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    const data = await response.json();
    return googleTokenResponseSchema.parse(data);
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(this.GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    const data = await response.json();
    return googleUserInfoSchema.parse(data);
  }
}
