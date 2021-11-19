import joi from 'joi';

const signUpSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
export { signUpSchema, signInSchema };
