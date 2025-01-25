import Joi from "joi";

export const taskValidation = Joi.object ({
    title : Joi.string().required().messages({
        "string.empty" : "Title is required to create task"
    }),
    description : Joi.string().required().messages({
        "string.empty" : "Description is required to create task"
    })
})