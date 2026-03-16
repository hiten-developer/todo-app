const Todo = require('../models/Todo')

const getTodos = async(req,res) => {
    try{
        const todos = await Todo.find({userId : req.user.id})
        return res.status(200).json({
            todo_list : todos
        })

    }
    catch(err){
        return res.status(500).json({
            message : "Server Err",
            err_msg : err.message
        })
    }

}
const createTodo = async(req,res) => {
    try{
        const todo_title = req.body.title
        const createdTodo = await Todo.create({
            title : todo_title,
            userId : req.user.id
        })

        return res.status(200).json({
            new_todo : createdTodo
        })
    }
    catch(err){
        return res.status(500).json({
            message : "Server Err",
            err_msg : err.message
        })
    }
}
const updateTodo = async(req,res) => {
    try{
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id,req.body,{new: true})
        return res.status(200).json({
            updated_todo : updatedTodo
        })
    }
    catch(err){
        return res.status(500).json({
            message : "Server Err",
            err_msg : err.message
        })
    }
}
const deleteTodo = async(req,res) => {
    try{
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            deleted_todo : deletedTodo
        })
    }
    catch(err){
        return res.status(500).json({
            message : "Server Err",
            err_msg : err.message
        })
    }
}

module.exports = {getTodos,createTodo,updateTodo,deleteTodo}