/* Run in the terminal from this repo's dir:
$ ~   psql -f schema.sql
*/

DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews;

CREATE TABLE reviewsTable (
  id SERIAL PRIMARY KEY, /*  Newly Added */
  game VARCHAR(50),
  gameId INT,
  author VARCHAR(50),
  numOfGames INT,
  numOfReviews INT,
  posted TIMESTAMP, /* updated from VARCHAR(50) */
  recordHours INT,
  body VARCHAR(1000),
  recommended BIT, /* represents BOOLEAN */
  helpful INT,
  unhelpful INT,
  funny INT,
  comments INT,
  userPhoto VARCHAR(350)
);