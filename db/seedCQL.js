const shell = require('shelljs');

function runSeed() {
  var runsOf100K = 0;

  function runAgain() {
    runsOf100K++;
    shell.exec('node db/cassandra.js', (code, output, error) => {
      if (runsOf100K < 100) { // 100000 x 100 === 10 Million records
        console.log('Runs out of 100:', runsOf100K);
        runAgain();
      } else {
        console.log('10 Million Records Seeded!');
        return;
      }
    });
  }
  runAgain(); // first invocation to begin recursion
}

runSeed();
// took about 22 min to write 10M records locally