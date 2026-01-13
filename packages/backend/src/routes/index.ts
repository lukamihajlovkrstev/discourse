import { Router } from 'express';
import authRoutes from './auth.routes';
import channelRoutes from './channel.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/channels', channelRoutes);

export default router;
