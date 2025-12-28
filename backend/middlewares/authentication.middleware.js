import jwt from 'jsonwebtoken';

export const checkForAuthenticationCookie = (cookieName) => {
  return (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (err) {
        console.error('Cookie token verification error:', err.message);
      }
    }
    next();
  };
};