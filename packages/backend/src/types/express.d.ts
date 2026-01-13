import { User } from '@discourse/shared';
import { Session } from './auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
      session?: Session | null;
    }
  }
}

export {};
