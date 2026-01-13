import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { sessionService } from '../services/session.service';
import { callbackQuerySchema } from '../types/auth.types';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const authService = new AuthService();

router.get('/login', async (req, res, next) => {
  try {
    const authUrl = authService.getAuthorizationUrl();
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
});

router.get('/callback', async (req, res, next) => {
  try {
    const query = callbackQuerySchema.parse(req.query);

    const tokenResponse = await authService.exchangeCodeForToken(query.code);

    const googleUser = await authService.getUserInfo(
      tokenResponse.access_token,
    );

    const user = await userService.create(googleUser);
    const session = await sessionService.create(user.id);

    res.cookie('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      domain: 'localhost',
    });

    res.cookie('hint', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: 'localhost',
    });

    res.redirect(process.env.CLIENT_URL!);
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get('/logout', protect, async (req, res, next) => {
  try {
    await sessionService.destroy(req.user!.id!);
    res.clearCookie('session');
    res.clearCookie('hint');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
