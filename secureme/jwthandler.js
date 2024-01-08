const jwt = require('jsonwebtoken');

class JwtHandler {
    constructor(secretKey) {
        this.secretKey = "#DyRou@PasswordKey0110$";
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