const shell = require('shelljs');

function runSeed() {
  var runsOf4000 = 0;
  var start = new Date();
  function runAgain() {
    runsOf4000++;
    shell.exec('node db/postgres.js', (code, output, error) => {
      if (runsOf4000 < 2500) { // 4000 x 2500 === 10 Million records
        console.log('Runs out of 2500:', runsOf4000);
        runAgain();
      } else {
        var end = new Date() - start;
        console.log('10 Million Records Seeded in', JSON.stringify(end).slice(0, 4), 'seconds');
        return;
      }
    });
  }
  runAgain(); // first invocation to begin recursion
}

runSeed();
// took 44 min to write 10M records locally