const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    // Перевірка на порожнє тіло запиту
    if (Object.keys(req.body).length === 0) {
      console.error("Missing fields in request body");
      return next(HttpError(400, "Missing fields"));
    }

    const phone = req.body.phone.replace(/\D/g, "");
    req.body.phone = phone;

    const { error } = schema.validate(req.body);

    if (error) {
      console.error("Validation error in request body:", error.details);
      return next(HttpError(400, "Validation error", error.details));
    }

    next();
  };
  return func;
};

module.exports = validateBody;
