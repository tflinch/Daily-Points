const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          // expression that requires number to be in a certain format
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "Your phone is required"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  //hash
  console.log("---------- Password---------,", this.password);
  let hash = bcrypt.hashSync(this.password, 12);
  console.log("----------HASH--------", hash);
  this.password = hash;
  next();
});

const User = mongoose.model("User", userSchema);

//make this model available for the index
module.exports = User;
