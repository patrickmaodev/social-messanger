import { Buffer } from 'buffer';

// Decode JWT without external libraries
const decodeJWT = (token) => {
    try {
        const [header, payload, signature] = token.split('.');
        if (!header || !payload || !signature) {
        throw new Error("Invalid token format");
        }
    
        // Decode the payload from Base64 using Buffer
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    
        console.log("Decoded Payload:", decodedPayload);
    
        return decodedPayload;
    } catch (error) {
        console.error("Error decoding JWT:", error.message);
        return null;
    }
};

// Check if the token is expired
const isTokenExpired = (token) => {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
    console.error("Invalid token");
    return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

// Verify token validity and expiration
const verifyToken = (token) => {
    if (!token) {
    console.error("Token not provided");
    return { isValid: false, decodedToken: null };
    }

    const decodedToken = decodeJWT(token);

    if (!decodedToken || isTokenExpired(token)) {
    console.error("Token is invalid or has expired");
    return { isValid: false, decodedToken: null };
    }

    return { isValid: true, decodedToken };
};

export { decodeJWT, isTokenExpired, verifyToken };
