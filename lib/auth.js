import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export function generateToken(userId) {
  return jwt.sign(
    {
      userId,
    },
    JWT_SECRET,
    // { expiresIn: '2h' } // 2 hours
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}