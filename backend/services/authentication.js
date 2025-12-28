import jwt from 'jsonwebtoken';

export function createTokenForUser(user) {
    const payload = {
        id: user.id,
        contactnumber: user.contactnumber,
        fullname: user.fullname,
        email: user.email
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    return token;
}

export function validateToken(token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
}
