import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    req.userId = payload.id;

    next();
  } catch (err) {
    return res.status(403).json({
      message:
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token",
    });
  }
};