const shell = require('shelljs');

function runSeed() {
  var runsOf100K = 0;

  function runAgain(n) { // n === starting `id` field
    runsOf100K++;
    shell.exec(`node db/cassandra.js ${n}`, (code, output, error) => {
      console.log('Runs out of 100:', runsOf100K);
      if (runsOf100K < 100) { // 100000 x 100 === 10 Million records
        runAgain(n + 100000);
      } else {
        return;
      }
    });
  }
  runAgain(0); // first invocation to begin recursion
}
runSeed();
// took about 22 min to write 10M records locally