/* Testing API - GET */
const axios = require('axios');

function testGET1rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.get(`http://localhost:3001/api/reviews/1`);
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 1 RPS')
      clearInterval();
      process.exit();
    }
  }, 1000); // 1 api call per second
}
// testGET1rps();

function testGET10rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.get(`http://localhost:3001/api/reviews/1`);
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 10 RPS')
      clearInterval();
      process.exit();
    }
  }, 100); // 10 api calls per second
}
// testGET10rps();

function testGET100rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.get(`http://localhost:3001/api/reviews/1`);
    axios.get(`http://localhost:3001/api/reviews/2`);
    axios.get(`http://localhost:3001/api/reviews/3`);
    axios.get(`http://localhost:3001/api/reviews/4`);
    axios.get(`http://localhost:3001/api/reviews/5`);
    axios.get(`http://localhost:3001/api/reviews/6`);
    axios.get(`http://localhost:3001/api/reviews/7`);
    axios.get(`http://localhost:3001/api/reviews/8`);
    axios.get(`http://localhost:3001/api/reviews/9`);
    axios.get(`http://localhost:3001/api/reviews/10`);
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 100 RPS')
      clearInterval();
      process.exit();
    }
  }, 100); // 100 api calls per second (because: 10 queries per call)
}
// testGET100rps();

function testGET400rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.get(`http://localhost:3001/api/reviews/1`);
    axios.get(`http://localhost:3001/api/reviews/2`);
    axios.get(`http://localhost:3001/api/reviews/3`);
    axios.get(`http://localhost:3001/api/reviews/4`);
    axios.get(`http://localhost:3001/api/reviews/5`);
    axios.get(`http://localhost:3001/api/reviews/6`);
    axios.get(`http://localhost:3001/api/reviews/7`);
    axios.get(`http://localhost:3001/api/reviews/8`);
    axios.get(`http://localhost:3001/api/reviews/9`);
    axios.get(`http://localhost:3001/api/reviews/10`);
    axios.get(`http://localhost:3001/api/reviews/11`);
    axios.get(`http://localhost:3001/api/reviews/12`);
    axios.get(`http://localhost:3001/api/reviews/13`);
    axios.get(`http://localhost:3001/api/reviews/14`);
    axios.get(`http://localhost:3001/api/reviews/15`);
    axios.get(`http://localhost:3001/api/reviews/16`);
    axios.get(`http://localhost:3001/api/reviews/17`);
    axios.get(`http://localhost:3001/api/reviews/18`);
    axios.get(`http://localhost:3001/api/reviews/19`);
    axios.get(`http://localhost:3001/api/reviews/20`);
    axios.get(`http://localhost:3001/api/reviews/21`);
    axios.get(`http://localhost:3001/api/reviews/22`);
    axios.get(`http://localhost:3001/api/reviews/23`);
    axios.get(`http://localhost:3001/api/reviews/24`);
    axios.get(`http://localhost:3001/api/reviews/25`);
    axios.get(`http://localhost:3001/api/reviews/26`);
    axios.get(`http://localhost:3001/api/reviews/27`);
    axios.get(`http://localhost:3001/api/reviews/28`);
    axios.get(`http://localhost:3001/api/reviews/29`);
    axios.get(`http://localhost:3001/api/reviews/30`);
    axios.get(`http://localhost:3001/api/reviews/31`);
    axios.get(`http://localhost:3001/api/reviews/32`);
    axios.get(`http://localhost:3001/api/reviews/33`);
    axios.get(`http://localhost:3001/api/reviews/34`);
    axios.get(`http://localhost:3001/api/reviews/35`);
    axios.get(`http://localhost:3001/api/reviews/36`);
    axios.get(`http://localhost:3001/api/reviews/37`);
    axios.get(`http://localhost:3001/api/reviews/38`);
    axios.get(`http://localhost:3001/api/reviews/39`);
    axios.get(`http://localhost:3001/api/reviews/40`);
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 400 RPS')
      clearInterval();
      process.exit();
    }
  }, 100); // 400 api calls per second (because: 40 queries per call)
  // THIS IS close to the MAX QUERY AMOUNT and MIN INTERVAL before errors occur
}
testGET400rps();