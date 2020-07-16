const Joi = require("@hapi/joi");

const chargeSchema = Joi.object({
  fullName: Joi.string().required(),
  creditCardNumber: Joi.string()
    .min(16)
    .max(16)
    .required(),
  creditCardCompany: Joi.string().required(),
  expirationDate: Joi.string().required(),
  cvv: Joi.string().required(),
  amount: Joi.number()
    .required()
    .strict()
});

module.export = chargeSchema;
