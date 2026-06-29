import jwt from "jsonwebtoken";

/**
 * Generates a signed JWT containing the user's ID.
 * We keep the payload minimal (just the ID) — never put sensitive data
 * like passwords or emails inside a JWT, since it can be decoded by anyone
 * who has the token (it's signed, not encrypted).
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
