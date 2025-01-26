const Joi = require("joi");


// Signup Validation
const signUpValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().required(),
    });
    return schema.validate(data);
};


// Signin Validation
const signInValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });
    return schema.validate(data);
};

module.exports = { signInValidation, signUpValidation };
