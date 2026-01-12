import { Router } from 'express';
import { AuthService } from '../services/auth.service';

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

export default router;
