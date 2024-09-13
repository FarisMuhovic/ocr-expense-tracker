const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

module.exports = validateEmail
