const { Schema, model } = require("mongoose")

const UserRole = Schema({
  _uid: {
    type: String,
    required: true
  },
  _gid: {
    type: String,
    required: true
  },
  roles: Array
})

module.exports = model("UserRoles", UserRole)

