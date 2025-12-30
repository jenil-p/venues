import jwt from 'jsonwebtoken';

 // this middleware sets the user in request's body by parsing the token 
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