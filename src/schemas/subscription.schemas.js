import joi from 'joi';

const subscriptionSchema = joi.object({
  addressData: joi.object({
    address: joi.string().required(),
    cep: joi.string().min(8).required(),
    name: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().min(2).max(2).required(),
  }),
  products: joi.object({
    tea: joi.boolean(),
    incense: joi.boolean(),
    organics: joi.boolean(),
  }),
  deliveryDay: joi.string().required(),
  planId: joi.number().min(1).max(2).required(),
  userId: joi.number().min(1).required(),
});

export default subscriptionSchema;
