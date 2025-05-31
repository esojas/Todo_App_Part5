import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    try {
        console.log('Auth middleware - Headers:', req.headers);
        const token = req.headers.authorization?.split(" ")[1];
        console.log('Auth middleware - Token:', token);
        
        if (!token) {
            console.log('Auth middleware - No token provided');
            return res.status(403).json({ message: "Token Expired or Invalid Authentication." });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log('Auth middleware - Token verification failed:', err.message);
                return res.status(403).json({ message: "Token Expired or Invalid Authentication." });
            }

            console.log('Auth middleware - Token verified, user:', user);
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth middleware - Error:', error);
        return res.status(500).json({ message: error.message });
    }
}