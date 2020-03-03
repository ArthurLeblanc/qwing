const keys = require('../config/keys');
const jwt = require('jsonwebtoken')

const login = (req, res, next) => {
    const token = req.header('auth-token')
    // Check si un token existe
    if (!token)
        return res.status(401).json({msg:'Pas de token, accès refusé'})
    try {
        const decodedToken = jwt.verify(token, keys.secretOrKey)
        req.user = decodedToken.user
        next()
    } catch (error) {
        res.status(401).json({msg: 'Token invalide'})
    }
}

module.exports = login