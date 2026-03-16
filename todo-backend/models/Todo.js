const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    completed : {
        type : Boolean,
        default : false,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }
},{timestamps : true})

const Todo = mongoose.model('todo',todoSchema)

module.exports = Todo