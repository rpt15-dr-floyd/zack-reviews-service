/* Run in the terminal from this repo's dir:
$ ~   psql -f schema.sql
*/

DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews;

CREATE TABLE reviewsTable (
  id SERIAL, /*  Newly Added */
  game VARCHAR(50),
  gameId INT,
  author VARCHAR(50),
  numOfGames INT,
  numOfReviews INT,
  posted VARCHAR(50), /* DATETIME is a possible alt */
  recordHours INT,
  body VARCHAR(1000),
  recommended BIT, /* Instead of BOOLEAN */
  helpful INT,
  unhelpful INT,
  funny INT,
  comments INT,
  userPhoto VARCHAR(350)
);