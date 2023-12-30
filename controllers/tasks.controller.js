const asyncHelper = require("../helpers/asyncHelper");
const customErrors = require("../helpers/customErrors");

const TaskSchema = require("../model/tasksSchema");
const getAlltasks = asyncHelper(async (req, res, next) => {
  let tasks = await TaskSchema.find({ createdBy: req.userToken });
  if (tasks) {
    res.status(200).json({ error: false, tasks });
  } else {
    next(customErrors("Tasks not found", 404));
  }
});
const updateTask = asyncHelper(async (req, res, next) => {
  let { id } = req.params;
  let { taskName, taskDescription, priority } = req.body;

  let task = await TaskSchema.findByIdAndUpdate(
    { _id: id },
    { taskName, taskDescription, priority },
    { new: true }
  );
  if (task) {
    res
      .status(200)
      .json({ error: false, message: "Task Updated Succesfully", task });
  } else {
    next(customErrors("Task not found", 404));
  }
});
const deleteTask = asyncHelper(async (req, res, next) => {
  let { id } = req.params;
  let task = await TaskSchema.findByIdAndDelete({ _id: id });

  if (task) {
    res.status(200).json({ error: false, task });
  } else {
    next(customErrors("Task not found", 404));
  }
});
const singleTask = asyncHelper(async (req, res, next) => {
  let { id } = req.params;
  let task = await TaskSchema.findById(id);

  if (task) {
    return res.status(200).json({ error: false, task });
  } else {
    next(customErrors("Task not found", 404));
  }
});
const addTask = asyncHelper(async (req, res, next) => {
  let { taskName, taskDescription, priority } = req.body;
  await TaskSchema.create({
    taskName,
    taskDescription,
    priority,
    createdBy: req.userToken,
  });
  res.status(200).json({
    error: false,
    message: "task added succesfully",
    task: { taskName, taskDescription, priority, createdBy: req.userToken },
  });
});
module.exports = { getAlltasks, updateTask, deleteTask, singleTask, addTask };
