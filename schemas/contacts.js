const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
});

module.exports = {
  schema,
};
