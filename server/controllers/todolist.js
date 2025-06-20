import TodolistModel from "../models/todolistModel.js";

// create to-do
export const createTodo = async (req, res) => {
    try {
        const { todo_image, todo_name, todo_desc, todo_status } = req.body
        const userId = req.user.id

        if (!todo_image || !todo_name || !todo_desc || !todo_status) {
            return res.status(400).json({ message: "Please fill in the required fields." })
        }

        const newTodo = await TodolistModel.create({
            todo_image,
            todo_name,
            todo_desc,
            todo_status,
            user: userId
        });

        res.status(200).json({ message: "Create a to do list successfully!", newTodo })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get all to-dos
export const getAllTodos = async (req, res) => {
    try {
        const userId = req.user.id
        const todos = await TodolistModel.find({ user: userId });
        res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update to-do
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id
        const { todo_image, todo_name, todo_desc, todo_status } = req.body;

        const updateData = {
            todo_image,
            todo_name,
            todo_desc,
            todo_status,
        }
        const updatedTodo = await TodolistModel.findOneAndUpdate(
            { _id: id, user: userId },
            updateData,
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "To-do not found." });
        }

        res.status(200).json({ message: "To-do updated successfully!", updatedTodo });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete to-do
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id
        const deletedTodo = await TodolistModel.findOneAndDelete({ _id: id, user: userId });

        if (!deletedTodo) {
            return res.status(404).json({ message: "To-do not found." });
        }

        res.status(200).json({ message: "To-do deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};