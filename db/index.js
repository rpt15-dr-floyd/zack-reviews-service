const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reviews', {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.once('open', () => {
  console.log('connected to mongoDb');
});

const Review = mongoose.model('reviews', {
  author: String,
  numOfGames: Number,
  numOfReviews: Number,
  posted: String,
  recordHours: Number,
  body: String,
  recommended: Boolean,
  helpful: Number,
  unhelpful: Number,
  funny: Number,
  comments: Number,
  userPhoto: String
});

const fetch = () => {
  return Review.find();
};

module.exports = {
  Review,
  fetch
};
