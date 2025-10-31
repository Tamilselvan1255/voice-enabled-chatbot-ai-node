const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(400).send({ error: "No token provided!" });
  }
  try {
    const token = authHeaders.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).send({ error: "Unauthorized user" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error while authorizing user", error.message);
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = authorization;
