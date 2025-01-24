import express from 'express';
import userRoutes from '../routes/userRoutes/index';
import roleRouter from '../routes/roles/index';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/roles', roleRouter);

export default router;