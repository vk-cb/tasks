import users from "../../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { statusCodes } from "../../utility/statusCodes";
import dotenv from "dotenv";
dotenv.config(); 
const secret = process.env.JWT_SECRET    
if (!secret) {
    throw new Error("Server Error,  Environment variable JWT_SECRET is not defined");
  }
  
export const userSignUpController = async (req : Request, res:Response,)=>{
    console.log(process.env.JWT_SECRET)
    try {
        const {email, password, name, role, } = req.body;
        const findUser = await users.findOne({email})
        if(findUser){
          res.send({msg : "User is already exist for this email adderss use another email"})
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

export const userLoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const findUser:any = await users.findOne({ email });

    // If user does not exist, send a response
    if (!findUser) {
       res
        .status(statusCodes.notFound)
        .send({ msg: "User does not exist for this email address. Use another email." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, findUser.password);

    // If password is invalid, send a response
    if (!isMatch) {
      res
        .status(statusCodes.unauthorized)
        .send({ msg: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: findUser._id, name: findUser.name, email: findUser.email },
      secret,
      { expiresIn: "1h" }
    );
// payload
const payload = {
  id: findUser._id,
  name: findUser.name,
  email: findUser.email,
  role: findUser.role,
  tasks: findUser.tasks,
  createdAt: findUser.createdAt,
  updatedAt: findUser.updatedAt
};
   
    // Respond with success
    res
      .status(statusCodes.success)
      .json({ msg: "User logged in successfully", token , data : payload });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(statusCodes.internalServerError).send({ msg: "Internal Server Error", error });
  }
};