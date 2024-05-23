const bcrypt = require("bcryptjs");

function validPassword(typeofPassword, userPassword) {
  let isCorrectPassword = bcrypt.compareSync(typeofPassword, userPassword);
  return isCorrectPassword;
}

module.exports = {
  validPassword,
};
