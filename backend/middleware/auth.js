const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== "object" || decoded === null) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token payload" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Unauthorized: Token has expired, please log in again"
        : "Unauthorized: Invalid token";
    return res.status(401).json({ success: false, message });
  }
};

module.exports = { authenticate, JWT_SECRET };
