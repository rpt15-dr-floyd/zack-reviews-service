const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../db/index.js');
const compression = require('compression');
const app = express();
const port = 3001;

app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.use('/:gameId', express.static(__dirname + '/../public'));
app.use('/', express.static(__dirname + '/../public'));
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// C.R.U.D. - READ
app.get('/api/reviews/:gameId', (req, res) => {
  var start = new Date();
  // console.log()
  db.fetch(req.params.gameId).then((data) => {
    res.status(200);
    res.send(JSON.stringify(data));

    // check how much time the call takes to complete
    var end = new Date() - start;

    console.log('Processing time:', end + 'ms')
  }).catch((err) => {
    res.status(500).send({ error: 'Unable to fetch reviews from the database' });
  });
});

// C.R.U.D. - CREATE
app.post('/api/reviews/:gameId', (req, res) => {
  var body = req.body; // req.body is RAW JSON
  body.gameId = req.params.gameId;

  new db.Review(body).save().then((result) => {
    console.log('Success!', result);
    res.end('Complete Post');
  });
});

// C.R.U.D. - UPDATE
app.put('/api/reviews/:gameId/:author', (req, res) => {
  var body = req.body; // req.body is RAW JSON
  db.Review.findOneAndUpdate(
    { gameId: req.params.gameId, author: req.params.author }, body, (err, result) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Successfully updated record ID:', result._id);
    }
    res.end('Complete Update');
  });
});

// C.R.U.D. - DELETE
app.delete('/api/reviews/:gameId/:author', (req, res) => {
  db.Review.findOneAndDelete(
    { gameId: req.params.gameId, author: req.params.author }, (err, result) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Successfully deleted record ID:', result._id);
    }
    res.end('Complete Delete');
  });
});

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
