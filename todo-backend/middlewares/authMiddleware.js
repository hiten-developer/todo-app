const jwt = require('jsonwebtoken')


const protect = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: "No Token Found!" })
    }
    const token = req.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid token!"
        })
    }
}

module.exports = { protect }