import { User } from '@discourse/shared';

declare module 'socket.io' {
  interface Socket {
    user: User;
  }
}
