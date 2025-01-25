import Joi from "joi";
import roles from "../../models/roles";

export const userValidation = Joi.object({
    name : Joi.string().required().messages({
        "string.empty": "Name of user is required",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Name of college is required",
      }),
    password: Joi.string().required().messages({
        "string.empty" : "Password is required to create user"
    }),
    role: Joi.string().required().messages({
        "string.empty" : "Role is required to create user"
    }),
    roles : Joi.string().required().messages({
        "string.empty" : "Role is required to create user"
    }),
    
})