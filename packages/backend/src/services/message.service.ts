import { Message, MessagesQuery, PaginatedMessages } from '@discourse/shared';
import { cassandra } from '../lib/cassandra';

export class MessageService {
  private get cassandra() {
    return cassandra.get();
  }

  async create(message: Message): Promise<Message> {
    const now = new Date();

    const query = `
    INSERT INTO messages (
      channel, message, user, username, picture, content
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

    const params = [
      message.channel,
      now,
      message.user,
      message.name,
      message.picture,
      message.content,
    ];

    await this.cassandra.execute(query, params, { prepare: true });

    return message;
  }

  async getMessages(
    channel: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedMessages> {
    let query: string;
    let params: any[];

    if (cursor) {
      query = `
        SELECT channel, message, user, username, picture, content
        FROM messages
        WHERE channel = ? AND message < ?
        ORDER BY message DESC
        LIMIT ?
      `;
      params = [channel, new Date(cursor), limit + 1];
    } else {
      query = `
        SELECT channel, message, user, username, picture, content
        FROM messages
        WHERE channel = ?
        ORDER BY message DESC
        LIMIT ?
      `;
      params = [channel, limit + 1];
    }

    const result = await this.cassandra.execute(query, params, {
      prepare: true,
    });

    const more = result.rows.length > limit;
    const messages = result.rows.slice(0, limit);

    const mappedMessages: Message[] = messages.map((row) => ({
      channel: row.channel,
      message: row.message,
      user: row.user,
      name: row.username,
      picture: row.picture,
      content: row.content,
    }));

    const next =
      more && messages.length > 0
        ? messages[messages.length - 1].message.toISOString()
        : null;

    return {
      messages: mappedMessages,
      next,
      more,
    };
  }
}

export const messageService = new MessageService();
