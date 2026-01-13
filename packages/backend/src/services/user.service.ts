import { cassandra } from '../lib/cassandra';
import { types } from 'cassandra-driver';
import { GoogleUserInfo } from '../types/auth.types';
import { User } from '@discourse/shared';

export class UserService {
  private get client() {
    return cassandra.get();
  }

  async find(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?';

    const result = await this.client.execute(query, [id], {
      prepare: true,
    });

    if (result.rowLength === 0) {
      return null;
    }

    const row = result.first();
    return this.map(row);
  }

  async create(user: GoogleUserInfo): Promise<User> {
    const existing = await this.find(user.id);
    const now = new Date();

    if (!existing) {
      await this.client.execute(
        `
          INSERT INTO users (id, email, name, picture, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [user.id, user.email, user.name, user.picture || null, now, now],
        {
          prepare: true,
        },
      );
    } else {
      await this.client.execute(
        `
          UPDATE users
          SET email = ?, name = ?, picture = ?, updated_at = ?
          WHERE id = ?
        `,
        [user.email, user.name, user.picture || null, now, user.id],
        {
          prepare: true,
        },
      );
    }

    const result = await this.find(user.id);
    return result!;
  }

  private map(row: types.Row | undefined): User {
    if (!row) {
      throw new Error('Row is undefined');
    }

    return {
      id: row.get('id'),
      email: row.get('email'),
      name: row.get('name'),
      picture: row.get('picture'),
      created_at: row.get('created_at'),
      updated_at: row.get('updated_at'),
    };
  }
}

export const userService = new UserService();
