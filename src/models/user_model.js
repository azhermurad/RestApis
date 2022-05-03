const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [7, "name should be 7 characters"],
  },
  email: {
    type: String,
    required: true,
    // unique:true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "must be greater than 6 characters"],
    validate(value) {
      if (value.toLowerCase() === "password")
        throw new Error("password should not contain this word");
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      },
    },
  ],

});

const bcrypt = require("bcryptjs");
const token = require("jsonwebtoken");
// userSchema.statics.findUserByCredentials = async (res) => {
//   res.send("da")
//   return;
// };

// the method on the schema are only available for the intance of the user

// now we will make the virtual relationship between the user and task
userSchema.virtual("tasks",{
  ref:"Task",
  localField: "_id",
  foreignField: "author"
})

userSchema.methods.jwtToken = async function () {
  const jwt = token.sign({ _id: this._id.toString() }, "myscreatekey");
  this.tokens= this.tokens.concat({token: jwt})
  await this.save()
  return jwt;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// userSchema.methods.nameChanger = function nameChanger() {
//     this.name="changdde"
// }
// userSchema.statics.add = function add(params) {
//   console.log("this");

// }

userSchema.methods.toJSON = function () {
  var obj = this.toObject(); //or var obj = this;
  delete obj.password;
  delete obj.tokens
  return obj;
};
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
const User = new model("User", userSchema);
module.exports = User;
