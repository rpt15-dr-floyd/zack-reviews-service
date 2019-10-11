/* Testing API - POST */
const axios = require('axios');

function testPOST1rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.post(`http://localhost:3001/api/reviews/1`, {author: 'A', recordHours: 1, body: 'test post'});
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 1 RPS')
      clearInterval();
      process.exit();
    }
  }, 1000); // 1 api call per second
}
// testPOST1rps();

function testPOST10rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.post(`http://localhost:3001/api/reviews/1`, {author: 'A', recordHours: 1, body: 'test post'});
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 10 RPS')
      clearInterval();
      process.exit();
    }
  }, 100); // 10 api calls per second
}
// testPOST10rps();

function testPOST100rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.post(`http://localhost:3001/api/reviews/1`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/3`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/2`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/4`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/5`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/6`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/7`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/8`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/9`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/10`, {author: 'A', recordHours: 1, body: 'test post'});
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 100 RPS')
      clearInterval();
      process.exit();
    }
  }, 100); // 100 api calls per second (because: 10 queries per call)
}
// testPOST100rps();

function testPOST400rps() {
  let start = new Date();
  setInterval(() => {
    let end = new Date();
    axios.post(`http://localhost:3001/api/reviews/1`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/3`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/2`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/4`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/5`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/6`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/7`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/8`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/9`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/10`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/11`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/12`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/13`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/14`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/15`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/16`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/17`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/18`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/19`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/20`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/21`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/22`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/23`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/24`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/25`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/26`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/27`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/28`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/29`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/30`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/31`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/32`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/33`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/34`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/35`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/36`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/37`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/38`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/39`, {author: 'A', recordHours: 1, body: 'test post'});
    axios.post(`http://localhost:3001/api/reviews/40`, {author: 'A', recordHours: 1, body: 'test post'});
    if (end - start >= 300000) { // run for 5 minutes
      console.log('Finished 400 RPS')
      clearInterval();
      process.exit();
    }
  }, 100); // 400 api calls per second (because: 40 queries per call)
  // THIS IS close to the MAX QUERY AMOUNT and MIN INTERVAL before errors occur
}
testPOST400rps();