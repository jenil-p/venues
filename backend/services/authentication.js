import jwt from 'jsonwebtoken';

export function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        username: user.username,
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
