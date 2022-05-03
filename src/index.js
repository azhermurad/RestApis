const express = require("express");
const users = require('./routers/userRouter');
const tasks = require("./routers/taskRouter");
require("./db/db_onnection");

const PORT = process.env.PORT || 4000;
const app = express();

// parse the incoming data
// app.use(express.static("public"))
app.use(express.json());
app.use(users)
app.use(tasks)
// read task

 
app.listen(PORT, () => {
  console.log("app is running on port:", PORT);
});


