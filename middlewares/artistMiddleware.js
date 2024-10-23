const jwt = require('jsonwebtoken');

exports.isAdmin = (req, res, next) => {
    const user = req.user; // Assuming req.user is populated by authentication middleware

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied. Admins only.');
    }
};

