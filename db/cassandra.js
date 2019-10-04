const cassandra = require('cassandra-driver');
const faker = require('faker');
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'reviews'
});

const q = `INSERT INTO reviewsTable (game, gameId, author, numOfGames, numOfReviews, posted, recordHours, body, recommended, helpful, unhelpful, funny, comments, userPhoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); `
const query = `BEGIN UNLOGGED BATCH ${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}${q}APPLY BATCH;`;

var count = 0;

function seedCQL() {
  count++;
  let queryArgs = [];
  for (let i = 0; i < 50; i++) {
    let bool = Math.round(Math.random());
    queryArgs.push(faker.company.companyName());
    queryArgs.push(faker.random.number());
    queryArgs.push(faker.internet.userName());
    queryArgs.push(faker.random.number());
    queryArgs.push(faker.random.number());
    queryArgs.push(JSON.stringify(faker.date.past()));
    queryArgs.push(faker.random.number());
    queryArgs.push(faker.lorem.paragraph());
    queryArgs.push(bool); // 0 or 1
    queryArgs.push(faker.random.number());
    queryArgs.push(faker.random.number());
    queryArgs.push(faker.random.number());
    queryArgs.push(faker.random.number());
    queryArgs.push(faker.image.avatar());
  }

  client.execute(query, queryArgs, { prepare : true })
    .then(() => {
      if (count < 2000) { // this produces 100,000 records
        seedCQL();
      } else {
        console.log('100K Records Seeded!');
        process.exit();
      }
    })
    .catch(err => console.log(err))
}

seedCQL();