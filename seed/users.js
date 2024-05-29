const { User } = require("../models");

// Create a User
User.create({
  name: "Sam Learns",
  email: "SamLearns@gmail.com",
  phone: "333-222-9898",
  password: "poiuytrewq",
})
  .then((user) => {
    console.log("--------NEW USER \n", user);
  })
  .catch((error) => {
    console.log(error);
  });
