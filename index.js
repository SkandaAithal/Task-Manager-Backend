const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/users.routes");
const taskRoutes = require("./routes/tasks.routes");
const cors = require("cors");
const app = express();
app.use(express.json());
const connectToDb = require("./db/connection");
app.use(cors());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.use((err, req, res, next) => {
  if (err.statuscode) {
    return res.status(err.statuscode).json({
      error: true,
      message: err.message,
    });
  }
  res.status(500).json({
    error: true,
    message: err.message,
  });
});

const startServer = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log("server running on port " + process.env.PORT);
    });

    await connectToDb(process.env.URL);
    console.log("db connected");
  } catch (err) {
    console.log(err.message);
  }
};

startServer();
