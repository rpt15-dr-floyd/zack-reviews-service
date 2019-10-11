require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const db = require('../db/index.js'); // MongoDB
const compression = require('compression');
const app = express();
const port = 3001;

/* POSTGRES CONFIG */
const { Client } = require('pg');
const pgClient = new Client({
  database: 'reviews'
});
pgClient.connect();

/* CASSANDRA CONFIG */
// const cassandra = require('cassandra-driver');
// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1'],
//   localDataCenter: 'datacenter1',
//   keyspace: 'reviews'
// });

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

/* C.R.U.D. - READ PostgreSQL */
app.get('/api/reviews/:gameId', (req, res) => {
  let query = `SELECT * FROM reviewstable WHERE gameId = ${req.params.gameId} ORDER BY posted DESC LIMIT 45`;
  pgClient.query(query)
    .then((data) => {
      res.status(200);
      res.send(data.rows);
    })
    .catch(err => {
      console.log(err)
      res.end('Not successful');
    })
});

/* C.R.U.D. - CREATE PostgreSQL */
app.post('/api/reviews/:gameId', (req, res) => {
  let query = `INSERT INTO reviewstable (gameId, author, posted, recordHours, body) VALUES ($1, $2, $3, $4, $5)`;
  let queryArgs = [req.params.gameId, req.body.author, new Date(), req.body.recordHours, req.body.body];
  pgClient.query(query, queryArgs).then(() => {
    res.end('Posted')
  })
  .catch(err => {
    console.log(err)
    res.end('Not successful');
  })
});

/* C.R.U.D. - UPDATE PostgreSQL */
app.put('/api/reviews/:gameId/:author', (req, res) => {
  let query  = `UPDATE reviewstable SET body = $1 WHERE gameId = $2 AND author = $3`;
  let queryArgs = [req.body.body, req.params.gameId, req.params.author];
  pgClient.query(query, queryArgs).then(() => {
    res.end('Successfully Updated Review');
  })
  .catch(err => {
    console.log(err)
    res.end('Not successful');
  })
});

/* C.R.U.D. - DELETE PostgreSQL */
app.delete('/api/reviews/:gameId/:author', (req, res) => {
  let query = `DELETE FROM reviewstable WHERE gameId = $1 AND author = $2`;
  let queryArgs = [req.params.gameId, req.params.author];
  pgClient.query(query, queryArgs).then(() => {
    res.end('Successful delete');
  })
  .catch(err => {
    console.log(err);
    res.end('Not successful');
  })
});

/* C.R.U.D. - READ Cassandra */
// app.get('/api/reviews/:gameId', (req, res) => {
  //   let query = `SELECT * FROM reviewstable WHERE gameId = ${req.params.gameId} ORDER BY posted DESC LIMIT 45`;
  //   client.execute(query, [], { prepare: true }).then((data) => {
    //     res.status(200);
    //     res.send(data.rows);

    //   }).catch(err => {
      //     console.log(err)
      //     res.end('Not successful');
      //   })
// });

// /* C.R.U.D. - CREATE Cassandra */
// app.post('/api/reviews/:gameId', (req, res) => {
//   let query = `INSERT INTO reviewstable (gameId, author, posted, recordHours, body) VALUES (?, ?, ?, ?, ?)`;
//   let queryArgs = [req.params.gameId, req.body.author, new Date(), req.body.recordHours, req.body.body];
//   client.execute(query, queryArgs, { prepare: true }).then(() => {
//     res.end('Posted')
//   })
//     .catch(err => {
//       console.log(err)
//       res.end('Not successful');
//     })
// });

// /* C.R.U.D. - UPDATE Cassandra */
// app.put('/api/reviews/:gameId', (req, res) => {
//   let query = `UPDATE reviewstable SET body = ? WHERE gameId = ? AND posted = ?`;
//   let queryArgs = [req.body.body, req.params.gameId, req.body.posted];
//   client.execute(query, queryArgs, { prepare: true }).then(() => {
//     res.end('Successfully Updated Review');
//   })
//     .catch(err => {
//       console.log(err)
//       res.end('Not successful');
//     })
// });

// /* C.R.U.D. - DELETE Cassandra */
// app.delete('/api/reviews/:gameId', (req, res) => {
//   let query = `DELETE FROM reviewstable WHERE gameId = ? AND posted = ?`;
//   let queryArgs = [req.params.gameId, req.body.posted];
//   client.execute(query, queryArgs, { prepare: true }).then(() => {
//     res.end('Successful delete');
//   })
//     .catch(err => {
//       console.log(err);
//       res.end('Not successful');
//     })
// });

// /* C.R.U.D. - READ MongoDB */
// app.get('/api/reviews/:gameId', (req, res) => {
//   var start = new Date();
//   // console.log()
//   db.fetch(req.params.gameId).then((data) => {
//     res.status(200);
//     res.send(JSON.stringify(data));

//     // check how much time the call takes to complete
//     var end = new Date() - start;

//     console.log('Processing time:', end + 'ms')
//   }).catch((err) => {
//     res.status(500).send({ error: 'Unable to fetch reviews from the database' });
//   });
// });

// /* C.R.U.D. - CREATE MongoDB */
// app.post('/api/reviews/:gameId', (req, res) => {
//   var body = req.body; // req.body is RAW JSON
//   body.gameId = req.params.gameId;

//   new db.Review(body).save().then((result) => {
//     console.log('Success!', result);
//     res.end('Complete Post');
//   });
// });

// /* C.R.U.D. - UPDATE MongoDB */
// app.put('/api/reviews/:gameId/:author', (req, res) => {
//   var body = req.body; // req.body is RAW JSON
//   db.Review.findOneAndUpdate(
//     { gameId: req.params.gameId, author: req.params.author }, body, (err, result) => {
//       if (err) {
//         console.log('Error:', err);
//       } else {
//         console.log('Successfully updated record ID:', result._id);
//       }
//       res.end('Complete Update');
//     });
// });

// /* C.R.U.D. - DELETE MongoDB */
// app.delete('/api/reviews/:gameId/:author', (req, res) => {
//   db.Review.findOneAndDelete(
//     { gameId: req.params.gameId, author: req.params.author }, (err, result) => {
//       if (err) {
//         console.log('Error:', err);
//       } else {
//         console.log('Successfully deleted record ID:', result._id);
//       }
//       res.end('Complete Delete');
//     });
// });

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
