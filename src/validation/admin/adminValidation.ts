import Joi from "joi";

export const adminValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Name of college is required",
      }),
    password: Joi.string().required(),
})