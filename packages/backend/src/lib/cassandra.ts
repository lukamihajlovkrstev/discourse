import { Client } from 'cassandra-driver';
import fs from 'fs';
import path from 'path';

class CassandraDatabase {
  private client: Client | null = null;

  async ensureKeyspace(): Promise<void> {
    const tempClient = new Client({
      contactPoints: process.env.CASSANDRA_CONTACT_POINTS!.split(','),
      localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER!,
      keyspace: 'system',
    });

    await tempClient.connect();

    const keyspace = process.env.CASSANDRA_KEYSPACE!;
    await tempClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      }
    `);

    await tempClient.shutdown();
  }

  async connect(): Promise<Client> {
    if (this.client) return this.client;

    await this.ensureKeyspace();

    this.client = new Client({
      contactPoints: process.env.CASSANDRA_CONTACT_POINTS!.split(','),
      localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER!,
      keyspace: process.env.CASSANDRA_KEYSPACE!,
    });

    await this.client.connect();
    console.log('Connected to Cassandra');

    await this.runMigrations();

    return this.client;
  }

  private async runMigrations(): Promise<void> {
    const migrationsDir = path.resolve(import.meta.dirname, '../../migrations');

    if (!fs.existsSync(migrationsDir)) {
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.cql'))
      .sort();

    if (files.length === 0) {
      return;
    }

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const cql = fs.readFileSync(filePath, 'utf-8');

      const statements = cql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        try {
          await this.client!.execute(statement);
        } catch (error) {
          throw error;
        }
      }
    }
  }

  get(): Client {
    if (!this.client) {
      throw new Error('Cassandra not connected');
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.shutdown();
      this.client = null;
      console.log('Disconnected from Cassandra');
    }
  }
}

export const cassandra = new CassandraDatabase();
