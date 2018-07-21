const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [ 2, 'Username must be at lease 2 characters' ],
    maxlength: [ 20, 'Username must at most 20 characters' ]
  },
  _id: {
    type: String,
    default: shortid.generate
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;