/* Run in the terminal from this repo's dir:
$ ~   cqlsh -f schemaCassandra.sql
*/

DROP KEYSPACE IF EXISTS reviews;

CREATE KEYSPACE reviews WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE reviews;

CREATE TABLE reviewsTable (
  /* id UUID PRIMARY KEY,  Newly Added */
  game text,
  gameId int,
  author text,
  numOfGames int,
  numOfReviews int,
  posted text,
  recordHours int,
  body text PRIMARY KEY,
  recommended Boolean,
  helpful int,
  unhelpful int,
  funny int,
  comments int,
  userPhoto text
);