const REQUIRED = {
  userRegister: ["userName", "email", "password"],
  userLogin: ["email", "password"],
};

const validator = (modelName) => {
  return (req, res, next) => {
    try {
      const requiredFields = REQUIRED[modelName] || [];
      const missingFields = requiredFields.filter((f) => !req.body[f]);

      if (missingFields.length > 0) {
        return res
          .status(400)
          .send({ error: `Missing fields: ${missingFields.join(", ")}` });
      }

      next();
    } catch (error) {
      console.error("Error while validating fields", error.message);
      return res.status(500).send({ error: "Internal server error" });
    }
  };
};

module.exports = validator;
