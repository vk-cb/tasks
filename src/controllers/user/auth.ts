import users from "../../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { statusCodes } from "../../utility/statusCodes";
const secret = process.env.JWT_SECRET || "secret"   
export const userSignUpController = async (req : Request, res:Response,)=>{
    console.log(process.env.JWT_SECRET)
    try {
        const {email, password, name, role, } = req.body;
        const findUser = await users.findOne({email})
        if(findUser){
          return  res.send({msg : "User is already exist for this email adderss use another email"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser =new users({email, password : hashedPassword, name, role}) 
        // console.log(newUser)
       await newUser.save()
       
        const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email,  }, secret, { expiresIn: '1h' });
        res.status(statusCodes.success).json({ msg: "User created successfully",  token });
    } catch (error) {
        res.status(statusCodes.internalServerError).send(error)
    }
}