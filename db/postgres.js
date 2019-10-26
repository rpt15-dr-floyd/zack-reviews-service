const faker = require('faker');
const { Client } = require('pg');
const pgClient = new Client({
  // user: 'Zack', password: '', host: '', port: '5432',
  database: 'reviews'
});

function seed(numOfData) {
  pgClient.connect()
    .then(() => {
      console.log('Connected to "reviews" database!')

      let reviewQueryArgs = [];
      let arr1 = '[';
      let arr2 = '[';
      let arr3 = '[';
      let arr4 = '[';
      let arr5 = '[';
      let arr6 = '[';
      let arr7 = '[';
      let arr8 = '[';
      let arr9 = '[';
      let arr10 = '[';
      let arr11 = '[';
      let arr12 = '[';
      let arr13 = '[';
      let arr14 = '[';
      let counter = 0;

      for (let i = 0; i < numOfData; i++) {
        let bool = Math.round(Math.random());
        reviewQueryArgs.push(faker.company.companyName());
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.internet.userName());
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.date.past());
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.lorem.paragraph());
        reviewQueryArgs.push(bool); // 0 or 1
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.random.number());
        reviewQueryArgs.push(faker.image.avatar());

        let commaOrClose = ',';
        if (i === numOfData - 1) {
          commaOrClose = ']';
        }

        arr1 += `$${1 + counter}${commaOrClose}`;
        arr2 += `$${2 + counter}${commaOrClose}`;
        arr3 += `$${3 + counter}${commaOrClose}`;
        arr4 += `$${4 + counter}${commaOrClose}`;
        arr5 += `$${5 + counter}${commaOrClose}`;
        arr6 += `$${6 + counter}${commaOrClose}`;
        arr7 += `$${7 + counter}${commaOrClose}`;
        arr8 += `$${8 + counter}${commaOrClose}`;
        arr9 += `$${9 + counter}${commaOrClose}`;
        arr10 += `$${10 + counter}${commaOrClose}`;
        arr11 += `$${11 + counter}${commaOrClose}`;
        arr12 += `$${12 + counter}${commaOrClose}`;
        arr13 += `$${13 + counter}${commaOrClose}`;
        arr14 += `$${14 + counter}${commaOrClose}`;

        if (i === numOfData - 1) {
          // these arrays must be explicitly told to represent int(integer), or bit(boolean)
          arr2 += `::int[]`;
          arr4 += `::int[]`;
          arr5 += `::int[]`;
          arr6 += `::timestamp[]`; // date/time
          arr7 += `::int[]`;
          arr9 += `::bit[]`; // boolean
          arr10 += `::int[]`;
          arr11 += `::int[]`;
          arr12 += `::int[]`;
          arr13 += `::int[]`;
        }
        counter += 14;
      }

      return (
        pgClient.query(`INSERT INTO reviewsTable (game, gameId, author, numOfGames, numOfReviews, posted, recordHours, body, recommended, helpful, unhelpful, funny, comments, userPhoto) VALUES (unnest(ARRAY${arr1}), unnest(ARRAY${arr2}), unnest(ARRAY${arr3}), unnest(ARRAY${arr4}), unnest(ARRAY${arr5}), unnest(ARRAY${arr6}), unnest(ARRAY${arr7}), unnest(ARRAY${arr8}), unnest(ARRAY${arr9}), unnest(ARRAY${arr10}), unnest(ARRAY${arr11}), unnest(ARRAY${arr12}), unnest(ARRAY${arr13}), unnest(ARRAY${arr14}))`, reviewQueryArgs)
      )
    })
    .then(() => console.log('Completed Seeding!'))
    .catch(err => console.log(err))
    .finally(() => pgClient.end())
}

seed(4000); // === 4 K --> the most records that can run at one time before array error occurs