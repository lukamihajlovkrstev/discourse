import { Channel, Member } from '@discourse/shared';
import { cassandra } from '../lib/cassandra';
import { nanoid } from 'nanoid';
import { redis } from '../lib/redis';

export class ChannelService {
  private get cassandra() {
    return cassandra.get();
  }

  private get redis() {
    return redis.get();
  }

  async create(
    id: string,
    name: string,
    picture: string | null,
    title: string,
  ): Promise<Channel> {
    const channel = nanoid();
    const joinedAt = new Date();

    const queries = [
      {
        query: `
        INSERT INTO channels_by_user (user, joined_at, channel, title, is_owner)
        VALUES (?, ?, ?, ?, true)
      `,
        params: [id, joinedAt, channel, title],
      },
      {
        query: `
        INSERT INTO users_by_channel (channel, joined_at, user, name, picture, is_owner)
        VALUES (?, ?, ?, ?, ?, true)
      `,
        params: [channel, joinedAt, id, name, picture],
      },
    ];

    await this.cassandra.batch(queries, { prepare: true });

    return {
      channel: channel,
      title,
      joined_at: joinedAt,
      is_owner: true,
    };
  }

  async rename(channel: string, title: string, owner: string): Promise<void> {
    const result = await this.cassandra.execute(
      'SELECT user, joined_at, is_owner FROM users_by_channel WHERE channel = ?',
      [channel],
      { prepare: true },
    );

    const user = result.rows.find((row) => row.user === owner);

    if (!user) {
      throw new Error('User is not a member of this channel');
    }

    if (!user.is_owner) {
      throw new Error('Only the channel owner can rename the channel');
    }

    const queries = result.rows.map((row) => ({
      query:
        'UPDATE channels_by_user SET title = ? WHERE user = ? AND joined_at = ? AND channel = ?',
      params: [title, row.user, row.joined_at, channel],
    }));

    await this.cassandra.batch(queries, { prepare: true });
  }

  async get(user: string): Promise<Channel[]> {
    const result = await this.cassandra.execute(
      `
      SELECT channel, title, joined_at, is_owner
      FROM channels_by_user
      WHERE user = ?
    `,
      [user],
      {
        prepare: true,
      },
    );

    return result.rows.map((row) => ({
      channel: row.channel,
      title: row.title,
      joined_at: row.joined_at,
      is_owner: row.is_owner,
    }));
  }

  async members(channel: string, user: string): Promise<Member[]> {
    const channels = await this.get(user);
    const isMember = channels.some((x) => x.channel === channel);

    if (!isMember) {
      throw new Error('User is not authorized to view this channel');
    }

    const result = await this.cassandra.execute(
      `
      SELECT user, name, picture, joined_at, is_owner
      FROM users_by_channel
      WHERE channel = ?
    `,
      [channel],
      {
        prepare: true,
      },
    );

    const onlineUsers: string[] = await this.redis.sMembers(
      `online_users:channel:${channel}`,
    );

    return result.rows.map((row) => ({
      user: row.user,
      name: row.name,
      picture: row.picture,
      joined_at: row.joined_at,
      is_owner: row.is_owner,
      online: onlineUsers.includes(row.user),
    }));
  }

  async delete(channel: string, owner: string): Promise<void> {
    const result = await this.cassandra.execute(
      'SELECT user, joined_at, is_owner FROM users_by_channel WHERE channel = ?',
      [channel],
      { prepare: true },
    );

    const user = result.rows.find((row) => row.user === owner);

    if (!user) {
      throw new Error('User is not a member of this channel');
    }

    if (!user.is_owner) {
      throw new Error('Only the channel owner can delete the channel');
    }

    const queries: Array<{ query: string; params: any[] }> = [];

    for (const row of result.rows) {
      queries.push({
        query:
          'DELETE FROM channels_by_user WHERE user = ? AND joined_at = ? AND channel = ?',
        params: [row.user, row.joined_at, channel],
      });
    }

    queries.push({
      query: 'DELETE FROM users_by_channel WHERE channel = ?',
      params: [channel],
    });

    await this.cassandra.batch(queries, { prepare: true });
  }
}

export const channelService = new ChannelService();
