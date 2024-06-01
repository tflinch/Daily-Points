const { Season } = require("../models");

Season.create({ season: 0 })
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
