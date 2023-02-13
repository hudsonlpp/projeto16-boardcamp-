import joi from 'joi';

export const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().required(),
  cpf: joi.string().length(11).regex(/^[0-9]+$/).required(),
  birthday: joi.date().required(),
});