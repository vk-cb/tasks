import express from 'express';
import userRoutes from '../routes/userRoutes/index';


const router = express.Router();

router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;