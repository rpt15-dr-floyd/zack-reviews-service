import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
const app = express();
const port = 3001;

import {createClient} from 'redis';
var redis = createClient(6379, 'localhost'); // or localhost or 127.0.0.1

/* POSTGRES CONFIG */
import { Client } from 'pg';
const pgClient = new Client({
  database: 'reviews', user: 'power_user', password: 'zack', host: 'ec2-54-219-188-70.us-west-1.compute.amazonaws.com', port: '5432'
});
pgClient.connect();

app.use('/', express.static(__dirname + '/../')); // *** FOR Loader.io
app.use('/:gameId', express.static(__dirname + '/../public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../client/src/Components/App.jsx';
import isPosOrNeg from '../client/src/utils/utilities.js';

/* C.R.U.D. - READ PostgreSQL */
app.get('/api/reviews/:gameId', (req, res) => {
  var gameId = req.params.gameId !== 'favicon.ico' ? req.params.gameId : 1;

  redis.get(gameId, (err, reply) => {
    if (err) { console.log(err); }
    else if (reply) { // Exists in cache
      console.log('made it to Redis')
      res.status(200);
      res.send(JSON.parse(reply));
    } else {
      console.log('did NOT make it to Redis')

  let query = `SELECT * FROM reviewstable WHERE gameId = ${gameId} ORDER BY posted DESC LIMIT 45`;
  pgClient.query(query)
    .then((data) => {
      redis.set(gameId, JSON.stringify(data.rows));
      res.status(200);
      res.send(data.rows);
    })
    .catch(err => {
      console.log(err)
      res.end('Not successful');
    })
    }
  });
});


app.use('/:gameId', (req, res, next) => {
  let gameId = req.params.gameId !== 'favicon.ico' ? req.params.gameId : 1;

  // let query = `SELECT * FROM reviewstable WHERE gameId = ${gameId} ORDER BY posted DESC LIMIT 45`;
  // pgClient.query(query)
  //   .then((data) => {
  //     // redis.set(gameId, JSON.stringify(data.rows));
  //     // console.log('data.rows', data.rows);
  //     let posOrNeg = isPosOrNeg(data.rows);
  //     let recent = [];
  //     let today = new Date();
  //     let thirtyDaysAgo = new Date(today - (30 * 86400000));
  //     for (let i = 0; i < data.rows.length; ++i) {
  //       let posted = new Date(data.rows[i].posted);
  //       if (thirtyDaysAgo <= posted && posted <= today) {
  //         recent.push(data.rows[i]);
  //       }
  //     }
  //     let recentPosOrNeg = isPosOrNeg(recent);

      fs.readFile('server/index.html', 'utf8', (err, page) => {
        if (err) { console.log(err); res.send(err);
        } else {
          res.send(page.replace(
            '<!--App-->', renderToString(<App />)
          ));

          /* The below version of this server-side render works (with the above commented-out code) but when the hydrate method fires it creates a mismatch - so the props that are being rendered here have to either get re-rendered when the page loads or the hydrate method needs to be skipped entirely. It is possible to simply serve the rendered page as a string, but there would be no dynamic state change possible on the rendered component once it's on the DOM. Instead I chose to serve the rendered page without pre-rendering the data, and get the data AFTER the component mounts on the DOM. */

          // res.send(page.replace(
          //   '<!--App-->', renderToString(<App reviews={data.rows} overallPosOrNeg={posOrNeg} recentPosOrNeg={recentPosOrNeg} recent={recent} gameId={gameId} />)
          // ));
          // next();
        }
      })

    // })
    // .catch(err => {
    //   console.log(err)
    //   res.end('Not successful');
    // })

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
  let query = `UPDATE reviewstable SET body = $1 WHERE gameId = $2 AND author = $3`;
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


app.listen(port, () => {
  console.log(`App listening on ${port}`);
});