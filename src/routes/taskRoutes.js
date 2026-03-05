import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  // - Create task
  const { title, description } = req.body
  // - Attach owner = req.user._id
  const owner = req.user._id
  try {
    const newTask = await Task.create({
      title,
      description,
      owner
    })
    return res.status(201).json(newTask)
  } catch  {
    return res.status(500).json({message: "error while creating task"})
  }
  
});

// GET /api/tasks
router.get("/", async (req, res) => {
  // - Return only tasks belonging to req.user
  const owner  = req.user._id
  try {
    const tasks = await Task.find({ owner })
    return res.status(200).json(tasks)
  } catch {
    return res.status(500).json({message: "error getting tasks"})
  }
 
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  // - Check ownership
  const owner = req.user._id
  const taskId = req.params.id
  // - Delete task
  try {
    const deleteTask = await Task.findOneAndDelete({ _id: taskId, owner: owner });
    if (!deleteTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "task deleted successfully" });
  } catch {
    return res.status(500).json({ message: "error deleting task" });
  }
});

export default router;