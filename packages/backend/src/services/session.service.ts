import { nanoid } from 'nanoid';
import { redis } from '../lib/redis';
import { Session } from '../types/auth.types';

export class SessionService {
  private readonly PREFIX = 'session:';
  private readonly SESSION_TTL = 7 * 24 * 60 * 60;
  private get client() {
    return redis.get();
  }

  async create(user: string): Promise<string> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_TTL * 1000);
    const id = nanoid();

    const session: Session = {
      user,
      createdAt: now,
      expiresAt,
    };

    await this.client.setEx(
      `${this.PREFIX}${id}`,
      this.SESSION_TTL,
      JSON.stringify(session),
    );

    return id;
  }

  async get(id: string): Promise<Session | null> {
    const data = await this.client.get(`${this.PREFIX}${id}`);

    if (!data) {
      return null;
    }

    try {
      const session = JSON.parse(data) as Session;

      if (new Date(session.expiresAt) < new Date()) {
        await this.destroy(id);
        return null;
      }

      return session;
    } catch (error) {
      return null;
    }
  }

  async destroy(sessionId: string): Promise<boolean> {
    const result = await this.client.del(`${this.PREFIX}${sessionId}`);
    return result > 0;
  }
}

export const sessionService = new SessionService();
