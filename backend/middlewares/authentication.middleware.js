import jwt from 'jsonwebtoken';

 // this middleware sets the user in request's body by parsing the token 
export const checkForAuthenticationCookie = (cookieName) => {
  return (req, res, next) => {
    const token = req.cookies?.[cookieName];

    if (!token) {
        req.user = null;
        return next();
    }

    if(token){
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ 
            message: "Invalid or expired authentication token. Please login again." 
        });
      }
    }

  };
};