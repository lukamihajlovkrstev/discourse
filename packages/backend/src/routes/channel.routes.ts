import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { channelService } from '../services/channel.service';
import { channelIdParamSchema } from '../types/channel.types';
import { createChannelSchema, updateChannelSchema } from '@discourse/shared';

const router = Router();

router.post('/', protect, async (req, res, next) => {
  try {
    const { title } = createChannelSchema.parse(req.body);

    const channel = await channelService.create(
      req.user!.id!,
      req.user!.name!,
      req.user!.picture || null,
      title,
    );

    res.status(201).json(channel);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const { id } = channelIdParamSchema.parse(req.params);
    const { title } = updateChannelSchema.parse(req.body);

    await channelService.rename(id, title, req.user!.id!);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const channels = await channelService.get(req.user!.id!);
    res.json(channels);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const { id } = channelIdParamSchema.parse(req.params);
    const users = await channelService.members(id, req.user!.id!);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const { id } = channelIdParamSchema.parse(req.params);
    await channelService.delete(id, req.user!.id!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
