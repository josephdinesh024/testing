// import jwt from 'jsonwebtoken';
import { jwtVerify, SignJWT } from 'jose';


const JWT_SECRET = process.env.JWT_SECRET

// export function generateToken(userId) {
//   return jwt.sign(
//     {
//       userId,
//     },
//     JWT_SECRET,
//     // { expiresIn: '2h' } // 2 hours
//   );
// }

// export function verifyToken(token) {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return null;
//   }
// }

export async function generateToken(userId) {
  const alg = 'HS256'; // Algorithm for signing
  const secretKey = new TextEncoder().encode(JWT_SECRET);

  const jwt = await new SignJWT({userId})
    .setProtectedHeader({ alg })
    .setIssuedAt()
    // .setExpirationTime('2h') // Example: expires in 2 hours
    .sign(secretKey);

  return jwt;
}

// To verify a JWT (e.g., in an Edge Middleware)
export async function verifyToken(token) {
  const secretKey = new TextEncoder().encode(JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}