const express = require("express");
const {
  getAlltasks,
  updateTask,
  deleteTask,
  singleTask,
  addTask,
} = require("../controllers/tasks.controller");
const auth = require("../helpers/auth");

const router = express.Router();
router.get("/getalltasks", auth, getAlltasks);
router.post("/addtask", auth, addTask);
router.post("/updatetask/:id", auth, updateTask);
router.delete("/deletetask/:id", auth, deleteTask);
router.get("/singletask/:id", auth, singleTask);

module.exports = router;
