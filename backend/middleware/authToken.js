const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')
    
    if(!token)return res.status(404).json({error : 'no token'})
    try {
        const user = jwt.verify(token, 'secretc0de1234123jbhb2@#$Gyh4SEG')
        next()
    } catch (error) {
        return res.status(403).json({error : 'token invalid'})
    }
    
}