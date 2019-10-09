/* Run in the terminal from this repo's dir:
$ ~   cqlsh -f schemaCassandra.sql
*/

DROP KEYSPACE IF EXISTS reviews;

CREATE KEYSPACE reviews WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE reviews;

CREATE TABLE reviewsTable (
  id int, /* id = given INDEX ON within the DB */
  game text,
  gameId int,
  author text,
  numOfGames int,
  numOfReviews int,
  posted timestamp,
  recordHours int,
  body text,
  recommended Boolean,
  helpful int,
  unhelpful int,
  funny int,
  comments int,
  userPhoto text,
  PRIMARY KEY (gameId, posted) /* gameId = PARTITION KEY, posted = CLUSTERING COL */
);