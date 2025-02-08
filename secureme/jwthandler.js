const jwt = require('jsonwebtoken');

class JwtHandler {
    constructor(secretKey) {
        // The secret key was manually replaced with an empty string.
        // As this repo is public, the secret key should not be read by the public.
        this.secretKey = "";
    }
    generateToken(payload, expiresIn = '3600h') {
        return jwt.sign(payload, this.secretKey);
    }
    verifyToken(token) {
        try{
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}

module.exports = JwtHandler;
