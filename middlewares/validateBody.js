const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    // Перевірка на порожнє тіло запиту
    if (Object.keys(req.body).length === 0) {
      return next(HttpError(400, "Missing fields"));
    }

    const { error } = schema.validate(req.body);

    if (error) {
      return next(HttpError(400, "Validation error", error.details));
    }

    next();
  };
  return func;
};

module.exports = validateBody;