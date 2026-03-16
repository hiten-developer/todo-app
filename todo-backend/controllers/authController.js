const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userModel = require('../models/User');


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const findUser = await userModel.findOne({ email })
        if (findUser) {
            return res.status(400).json({
                err: "Email is Already Exists Try Another Email..."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        return res.status(200).json({
            message: "Signup Sucessfully",
            token: token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Server Err",
            err_msg: err.message
        })
    }

}

const login = async (req, res) => {

    try {
        const { email, password } = req.body
        const findUser = await userModel.findOne({ email })
        if (!findUser) {
            return res.status(404).json({
                err: "OOps User not Found!"
            })
        }
        const isMatch = await bcrypt.compare(password, findUser.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        return res.status(200).json({
            message: "Login Sucessfully",
            token: token,
            user: { id: findUser._id, email: findUser.email }
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Server Err",
            err_msg: err.message
        })
    }
}

module.exports = {signup,login}