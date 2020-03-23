const keys = require('../config/keys');
const jwt = require('jsonwebtoken')

const login = async(req, res, next) => {
    const token = req.header('auth-token')
    // Check si un token existe
    if (!token)
        return res.status(401).json({msg:'Pas de token, accès refusé'})
    try {
        const decodedToken = await jwt.verify(token, keys.secretOrKey)
        req.user = decodedToken.user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({msg: 'Token invalide'})
    }
}

module.exports = login