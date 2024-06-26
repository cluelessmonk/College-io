const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.body['auth-token'];
    if (!token) {
        res.status(401).json({});
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (err) {
        res.status(500).json({});
    }
}