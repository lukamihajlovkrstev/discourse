import {
  Channel,
  User,
  WebSocketEventPayload,
  WebSocketEventType,
  WebSocketMessages,
} from '@discourse/shared';
import { consumer, redis } from '../lib/redis';
import { Server } from 'socket.io';
import { channelService } from './channel.service';

const STREAM = 'events';
const CONSUMER = 'main';
const GROUP = process.env.SOCKET_ID!;

export class RealtimeService {
  private get client() {
    return redis.get();
  }

  private get consumerClient() {
    return consumer.get();
  }

  async online(user: User, channels: Channel[]) {
    const pipeline = this.client.multi();
    for (const channel of channels) {
      pipeline.sAdd(`online_users:channel:${channel.channel}`, user.id);
    }
    await pipeline.exec();
  }

  async offline(user: User, channels: Channel[]) {
    const pipeline = this.client.multi();
    for (const channel of channels) {
      pipeline.sRem(`online_users:channel:${channel.channel}`, user.id);
    }
    await pipeline.exec();
  }

  async status(channel: Channel) {
    return await this.client.sMembers(
      `online_users:channel:${channel.channel}`,
    );
  }

  async publish<T extends WebSocketEventType>(
    type: T,
    payload: WebSocketEventPayload<T>,
  ): Promise<void> {
    await this.client.xAdd(STREAM, '*', {
      type,
      payload: JSON.stringify(payload),
    });
  }

  consumer(io: Server) {
    void (async () => {
      try {
        await this.loop(io);
      } catch (err) {
        console.error('Consumer crashed', err);
      }
    })();
  }

  private async loop(io: Server) {
    try {
      await this.consumerClient.xGroupCreate(STREAM, GROUP, '$', {
        MKSTREAM: true,
      });
    } catch (err: any) {
      if (!err.message.includes('BUSYGROUP')) {
        console.error('Failed to create group:', err);
      }
    }

    const processMessages = async () => {
      const response = await this.consumerClient.xReadGroup(
        GROUP,
        CONSUMER,
        { key: STREAM, id: '>' },
        { BLOCK: 5000 },
      );

      if (response) {
        for (const stream of response) {
          for (const message of stream.messages) {
            const data: WebSocketMessages = {
              type: message.message.type,
              payload: JSON.parse(message.message.payload),
            } as WebSocketMessages;

            switch (data.type) {
              case 'status':
                const channels = await channelService.get(data.payload.user);
                if (channels) {
                  for (const channel of channels) {
                    io.to(`channel:${channel.channel}`).emit(
                      data.type,
                      data.payload,
                    );
                  }
                }
                break;
            }

            await this.consumerClient.xAck(STREAM, GROUP, message.id);
          }
        }
      }

      setImmediate(processMessages);
    };

    processMessages();
  }
}

export const realtimeService = new RealtimeService();
