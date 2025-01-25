import { UserDocument } from "./src/models/users/index"; 
import { Request } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: UserDocument; 
        }
    }
}

export interface CustomRequest extends Request {
    user?: any; // Replace `any` with your user model type
}