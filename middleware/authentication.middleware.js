const _ = require("lodash");
const config = require("../config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const ReqHeaders = req.headers;
    const HeaderAuthorization = ReqHeaders.authorization || "";

    if (HeaderAuthorization.startsWith("Bearer ")) {
        const BearerToken = ReqHeaders.authorization.split(' ')[1];
        if (BearerToken) {
            try {
                const PublicKey = config.tokenSettings.publicKey;
                const ApiKey = config.tokenSettings.apiSecretKey;
                if (!_.isNil(ApiKey) && BearerToken === ApiKey) {
                    req.jwtDecode = req.query || {};
                } else {
                    req.jwtDecode = jwt.verify(BearerToken, PublicKey);
                }
                return next();
            } catch (error) {
                console.log(`Error:`, error);
                return res.status(401).send({ 'message': 'Invalid Access Token' });
            }
        }
    }
    return res.status(401).send({ 'message': 'Missing Authorization Header' });
};