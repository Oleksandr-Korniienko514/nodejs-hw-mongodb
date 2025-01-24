import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({

        'string.base': 'Name should be a string',
        'string.empty': 'Name is required.',
        'string.min': 'Name should have at least 3 characters long',
        'string.max': 'Name should have at most 20 characters long',
        'any.required': 'Name is required field',
    }),
    phoneNumber: Joi.string().min(10).max(15).required().messages({
        'string.base': 'Phone number should be a string',
        'string.empty': 'Name is required.',
        'string.min': 'Phone number should have at least 10 characters long',
        'string.max': 'Phone number should have at most 15 characters long',
        'any.required': 'Phone number is required field',
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Email should be valid email adress',
        'string.empty': 'Email cannot be emty',
    }),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string()
        .valid('work', 'home', 'personal')
        .default('personal')
        .required()
        .messages({
            'string.base': 'Contact type should be a string',
            'string.empty': 'Contact type is required field',
        }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
        'string.base': 'Name should be a string',
        'string.min': 'Name should have at least 3 characters long',
        'string.max': 'Name should have at most 20 characters long',
    }),
    phoneNumber: Joi.string().min(10).max(15).messages({
        'string.base': 'Phone number should be a string',
        'string.min': 'Phone number should have at least 10 characters long',
        'string.max': 'Phone number should have at most 15 characters long',
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Email should be valid email adress',
    }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid('work', 'home', 'personal').messages({
        'string.base': 'Contact type should be a string',
    }),
})
    .min(1)
    .messages({
        'object.min': 'Contact should be updating',
    }); 
