import Role from '../../models/roles/index';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/users';

const router = express.Router();

router.get('/get-roles', async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles' });
    }
});

router.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    try {
        await user.save();       
        res.json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// router.post('/login', async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         res.json({ message: 'User logged in successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in user' });
//     }
// });

export default router;