const { Profile } = require('../models/profile');

const authenticateUser = function (req, res, next) {
    let token = req.header('x-auth');
    Profile.findByToken(token).then((profile) => {
        req.locals = {
            profile,
            token,
        }
        next();
    }).catch((err) => {
        res.status(401).send(err);
    });
}

const authorizeUser = function (req, res, next) {
    if(req.locals.profile.role == 'admin') {
        next();
    } else {
        res.status(403).send('you are not authorized to access this page');
    }
}

module.exports = {
    authenticateUser, authorizeUser
}