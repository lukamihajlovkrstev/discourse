import { createClient, RedisClientType } from 'redis';

class RedisDatabase {
  private client: RedisClientType | null = null;

  async connect(): Promise<RedisClientType> {
    if (this.client) return this.client;

    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connecting to Redis...');
    });

    this.client.on('ready', () => {
      console.log('Connected to Redis');
    });

    await this.client.connect();

    return this.client;
  }

  get(): RedisClientType {
    if (!this.client) {
      throw new Error('Redis not connected');
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      console.log('🔌 Disconnected from Redis');
    }
  }
}

export const redis = new RedisDatabase();
export const consumer = new RedisDatabase();
