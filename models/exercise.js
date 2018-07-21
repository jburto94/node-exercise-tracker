const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  username: String,
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  description: {
    type: String,
    required: true,
    maxlength: [ 40, 'Description can only be up to 40 characters long' ]
  },
  duration: {
    type: Number,
    required: true,
    min: [ 1, 'Duration must be at least 1' ]
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;