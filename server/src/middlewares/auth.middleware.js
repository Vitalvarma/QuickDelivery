import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(403).json({ message: 'User no longer exists' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};