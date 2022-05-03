const mongoose = require("mongoose");
const {Schema,model} = mongoose;

// now we have to define the collection of the tasks in the database 
// the model is the collection and schema is the document blue print of the document in the database 
const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
    minlength: [7, "Description should be greater than seven character!"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User" // name of the model 
  },
});
const  Task = mongoose.model("Task", taskSchema);

module.exports = Task;