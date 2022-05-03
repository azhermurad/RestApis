const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task_model");
const router = express.Router();

router.get("/tasks", auth,async (req, res) => {
  try {
    const tasks = await Task.find({}).populate({path: "author",select: "name"});
    res.status(200).send({ data: tasks });
  } catch (error) {
    res.status(500).send();
  }
});
// read single users
router.get("/tasks/:id", auth,async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).send({ error: "No task found by this ID!" });
    }
    res.send({ data: task });
  } catch (error) {
    res.status(500).send();
  }
});

// task Routers
router.post("/tasks",auth, async (req, res) => {
  const user = req.user;
  const task = new Task({...req.body,author: user._id});
  try {
    await task.save();
    res.status(201).send({ data: task });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id",auth, async (req, res) => {
 
  try {
     const task = await Task.findOne({
       _id: req.params.id,
       author: req.user._id,
     });
       if (!task) {
         res.send({ error: "Task is not found!" });
         return;
       }
     await task.remove();
  
    res.send({ data: task });
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: "something went wrong!! Please try again" });
  }
});

module.exports = router;