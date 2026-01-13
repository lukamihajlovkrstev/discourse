import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';

const sessionService = new SessionService();
const userService = new UserService();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.cookies?.session;

    if (!id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = await sessionService.get(id);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userService.find(session.user);

    req.session = session;
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
