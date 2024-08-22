import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const generateToken = (user) => {
    return jwt.sign({
        user: user.id,
        name: user.name, 
        role: user.role
    }, JWT_SECRET, { expiresIn: '4h' });
}
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export const decodeToken = (token) => {
    return jwt.decode(token, { complete: true });
}
