const express = require('express')
const {protect} = require('../middlewares/authMiddleware')
const {getTodos,createTodo,updateTodo,deleteTodo} = require('../controllers/todoController')
const router = express.Router()

router.get('/',protect,getTodos)
router.post('/',protect,createTodo)
router.put('/:id',protect,updateTodo)
router.delete('/:id',protect,deleteTodo)

module.exports = router