const validateEmail = require("./emailValidator")

const validateAuthPayload = (email, password, confirmPassword) => {
  if (!email || !password || !confirmPassword) {
    return {code: 400, message: "All fields are required"}
  }
  if (!validateEmail(email)) {
    return {code: 400, message: "Invalid email format"}
  }
  if (password !== confirmPassword) {
    return {code: 400, message: "Passwords do not match"}
  }
  return {code: 200, message: "Validation succeeded"}
}

module.exports = validateAuthPayload
