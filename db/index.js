const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/reviews', {useNewUrlParser: true});
// mongoose.connect('mongodb://database/reviews', {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.once('open', () => {
  console.log('connected to mongoDb');
});

const Review = mongoose.model('reviews', {
  game: String,
  gameId: Number,
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

const fetch = (gameId) => {
  return Review.find({gameId: gameId});
};

module.exports = {
  Review,
  fetch
};
