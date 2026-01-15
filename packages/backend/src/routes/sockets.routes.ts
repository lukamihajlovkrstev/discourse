import { Server, Socket } from 'socket.io';
import { Channel, User } from '@discourse/shared';
import { realtimeService } from '../services/realtime.service';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';
import { parse } from 'cookie';
import { channelService } from '../services/channel.service';

interface ConnectionData {
  user: User;
  channels: Channel[];
}

const connections = new Map<string, ConnectionData>();
const sessionService = new SessionService();
const userService = new UserService();

export function setupSockets(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND!,
      credentials: true,
    },
    pingTimeout: 20000,
    pingInterval: 10000,
    transports: ['websocket', 'polling'],
  });

  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;

      if (!cookies) {
        return next(new Error('Missing authentication data'));
      }

      const parsed = parse(cookies);
      const id = parsed.session;

      if (id == null) {
        return next(new Error('Unauthorized'));
      }

      const session = await sessionService.get(id);
      if (!session) {
        return next(new Error('Unauthorized'));
      }

      const user = await userService.find(session.user);
      if (!user) {
        return next(new Error('Unauthorized'));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    console.log(`User ${socket.user.id} connected: ${socket.id}`);

    try {
      const channels = await channelService.get(socket.user.id);

      connections.set(socket.id, {
        user: socket.user,
        channels,
      });

      for (const channel of channels) {
        await socket.join(`channel:${channel.channel}`);
      }

      await realtimeService.online(socket.user, channels);
      await realtimeService.publish('status', {
        user: socket.user.id,
        online: true,
      });
    } catch (error) {
      console.error('Error during connection setup:', error);
      socket.disconnect(true);
      return;
    }

    socket.on('disconnect', async (reason) => {
      console.log(`Socket ${socket.id} disconnected: ${reason}`);

      const data = connections.get(socket.id);
      if (!data) return;

      try {
        await realtimeService.offline(data.user, data.channels);
        await realtimeService.publish('status', {
          user: socket.user.id,
          online: false,
        });

        connections.delete(socket.id);
      } catch (error) {
        console.error('Error during disconnect cleanup:', error);
        connections.delete(socket.id);
      }
    });

    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}
