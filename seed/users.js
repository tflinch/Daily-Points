const { User } = require("../models");

// Create a User
User.create({
  name: "Lester Black",
  email: "LesterBlack@gmail.com",
  phone: "333-222-9898",
  password: "poiuytrewq",
})
  .then((user) => {
    console.log("--------NEW USER \n", user);
  })
  .catch((error) => {
    console.log(error);
  });
