const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const createKey = (jsonObj) => {
  if (!jsonObj) {
    return false;
  }

  const key = jwt.sign(jsonObj, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  return key;
};

const checkKey = (jsonObj) => {
  if (!jsonObj) {
    return false;
  }

  try {
    const isOk = jwt.verify(jsonObj, process.env.JWT_TOKEN);
    return isOk ? true : false;
  } catch (error) {
    console.log(`Failed to verify JWT with error:\n${error}`);
    return false;
  }
};

module.exports = { createKey, checkKey };
