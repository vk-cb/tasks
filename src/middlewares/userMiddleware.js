import jwt from 'jsonwebtoken'
import users from '../models/users'
const secret = process.env.JWT_SECRET
import {statusCodes} from '../utility/statusCodes'
import { userValidation } from '../validation/users/userValidation'
exports.userAuthMiddleware = async(req, resp, next)=>{
    const token = req.header('token')

    const usersData = req.body;
    const { error } = userValidation.validate(usersData);
    if (error) {    
        return resp.status(statusCodes.badRequest).json({ msg: error.details[0].message });
    }
    
    if(!token){
      return resp.status(statusCodes.unauthorized).json({msg : "please provide token"})
    }
    
    try {
        const decoded = jwt.verify(token,secret)
        req.user = await users.findById(decoded.id)
        if(!req.user){
            resp.status(statusCodes.notFound).json({msg: "You have entered invalid token"})
        }
        next()
        
    } catch (error) {
        console.error("Token verification error:", error);
        resp.status(statusCodes.notFound).json({ msg: "You have entered invalid token" });
    }
}