import { Router } from 'express';
import authRoutes from './auth';
import videoRoutes from './video';
import channelRoutes from './channel'


const router = Router();

// export const prisma = new PrismaClient();

router.use('/auth', authRoutes);
router.use('/videos',videoRoutes);
router.use('/',channelRoutes)

export default router;
