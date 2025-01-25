const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Missing first name or last name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter correct email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateProfileEditData = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "skills",
    "about",
    "photoURL",
    "gender",
  ];
  const isUpdateallowed = Object.keys(req.body).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );

  if (!isUpdateallowed) {
    throw new Error("This Update not allowed");
  }
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
};
