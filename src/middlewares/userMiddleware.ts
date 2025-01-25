import jwt from 'jsonwebtoken';
import users from '../models/users';
import dotenv from 'dotenv';
import { statusCodes } from '../utility/statusCodes';
import { userValidation } from '../validation/users/userValidation';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../types';

dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export const userAuthMiddleware = async (req: CustomRequest, resp: Response, next: NextFunction): Promise<void> => {
    const token = req.header('token');

    // Validate user data if needed
    const usersData = req.body;
 
    if (!token) {
        resp.status(statusCodes.unauthorized).json({ msg: "Please provide token" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as { id: string }; 
        const user = await users.findById(decoded.id);
        if (!user) {
            resp.status(statusCodes.notFound).json({ msg: "Invalid token: User not found" });
            return;
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Token verification error:", error);
        resp.status(statusCodes.unauthorized).json({ msg: "Invalid token" });
    }
};
