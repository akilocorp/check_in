const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    // Get the value of the 'Authorization' header from the request
    const authHeader = req.headers['authorization'];

    // If no Authorization header is present, return 401 Unauthorized
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing. A valid token is required for this operation.' });
    }

    // Extract the token. The header is typically in the format "Bearer TOKEN".
    // We split by space and take the second element.
    const token = authHeader.split(' ')[1];

    // If the token itself is missing after splitting (e.g., just "Bearer "), return 401
    if (!token) {
        return res.status(401).json({ message: 'Token missing. Expected format: "Bearer [your_token]".' });
    }

    // Verify the token using the secret key.
    // jwt.verify takes the token, the secret, and a callback function.
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        // If there's an error during verification (e.g., token is expired, invalid signature)
        if (err) {
            console.error('JWT verification failed:', err.message); // Log the error for server-side debugging
            // Return 403 Forbidden, indicating the client does not have permission to access
            return res.status(403).json({ message: 'Invalid or expired token. Access denied.' });
        }

        // If verification is successful, attach the decoded payload to the request object.
        // This makes the authenticated user's information (from the token) available
        // to subsequent middleware and the route handler (scanUsers function).
        req.user = decoded;
        // Call next() to pass control to the next middleware function in the stack (e.g., scanUsers)
        next();
    });
};

module.exports = verifyToken; 