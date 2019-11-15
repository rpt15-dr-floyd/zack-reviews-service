import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App.jsx';

ReactDOM.hydrate(<App />, document.getElementById('reviews'));
// ReactDOM.render(<App />, document.getElementById('reviews'));


// import axios from 'axios';
// import isPosOrNeg from './utils/utilities.js'
// var reviews, overallPosOrNeg, recentPosOrNeg, recent, gameId;
// axios.get(`http://localhost:3001/api/reviews/${window.location.pathname.split('/')[1]}`) // this is RETURNING an HTML file
//     // axios.get(`http://localhost:3001/api/reviews/1`)
//     // axios.get(`http://ec2-54-193-72-13.us-west-1.compute.amazonaws.com:3001/api/reviews/${this.state.gameId}`)
//     .then((data) => {
//       console.log('data', data)
//         reviews = data.data;
//         overallPosOrNeg = isPosOrNeg(reviews);
//       let recentArr = [];
//       let today = new Date();
//       let thirtyDaysAgo = new Date(today - (30 * 86400000));
//       for (let i = 0; i < reviews.length; ++i) {
//         let posted = new Date(reviews[i].posted);
//         if (thirtyDaysAgo <= posted && posted <= today) {
//           recentArr.push(reviews[i]);
//         }
//       }
//         recentPosOrNeg = isPosOrNeg(recentArr);
//         recent = recentArr;
//     })
//     .catch((err) => {
//       throw(err);
//     });
// ReactDOM.hydrate(<App reviews={reviews} overallPosOrNeg={overallPosOrNeg} recentPosOrNeg={recentPosOrNeg} recent={recent} gameId={gameId} />, document.getElementById('reviews'));