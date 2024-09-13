const bcrypt = require("bcrypt")

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

async function comparePasswords(raw, hash) {
  return await bcrypt.compare(raw, hash)
}

module.exports = {
  hashPassword,
  comparePasswords,
}
