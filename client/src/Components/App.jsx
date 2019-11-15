import React from 'react';
import axios from 'axios';
import isPosOrNeg from '../utils/utilities.js';
import Reviews from './Reviews.jsx';
// import window from 'global';
// import document from 'global/document';
// import style from '../Styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // gameId: window.location.pathname.split('/')[1],  // this will not work with SSR bc "window" is not defined

      /* state below was written this way to accomodate SSR when I was passing props down to the client from the server */
      gameId: this.props.gameId ? this.props.gameId : 1,
      reviews: this.props.reviews ? this.props.reviews : [],
      overallPosOrNeg: this.props.overallPosOrNeg ? this.props.overallPosOrNeg : '',
      recentPosOrNeg: this.props.recentPosOrNeg ? this.props.recentPosOrNeg : '',
      recent: this.props.recent ? this.props.recent : []
    };
  }

  componentDidMount () {
    axios.get(`http://ec2-54-193-72-13.us-west-1.compute.amazonaws.com:3001/api/reviews/${window.location.pathname.split('/')[1]}`)
    // axios.get(`http://localhost:3001/api/reviews/${window.location.pathname.split('/')[1]}`)
    // axios.get(`http://localhost:3001/api/reviews/1`)
    .then((data) => {
      this.setState({
        reviews: data.data
      });
    })
    .then(() => {
      let posOrNeg = isPosOrNeg(this.state.reviews);
      this.setState({
        overallPosOrNeg: posOrNeg
      });
    })
    .then(() => {
      let recent = [];
      let today = new Date();
      let thirtyDaysAgo = new Date(today - (30 * 86400000));
      for (let i = 0; i < this.state.reviews.length; ++i) {
        let posted = new Date(this.state.reviews[i].posted);
        if (thirtyDaysAgo <= posted && posted <= today) {
          recent.push(this.state.reviews[i]);
        }
      }
      let posOrNeg = isPosOrNeg(recent);
      this.setState({
        recentPosOrNeg: posOrNeg,
        recent: recent
      });
    })
    .catch((err) => {
      throw(err);
    });
  }

  render() {
    return (
      <div>
        <h2>CUSTOMER REVIEWS</h2>
        <div className="statContainer">
          <div className="statBar">
            <div className="summary">
              <div className="title">Overall Reviews:</div>
              <span className="posOrNeg"> {this.state.overallPosOrNeg} </span>
              <span className="numOfRevs">({this.state.reviews.length} reviews)</span>
            </div>
          </div>
          <div className="statBar">
            <div className="summary">
              <div className="title">Recent Reviews:</div>
              <span className="posOrNeg"> {this.state.recentPosOrNeg} </span>
              <span className="numOfRevs">({this.state.recent.length} reviews)</span>
            </div>
          </div>
        </div>
        <div className="filterContainer">
          <div className="filterMenu">
            <div className="filterTitle">Review Type</div>
          </div>
          <div className="filterMenu">
            <div className="filterTitle">Purchase Type</div>
          </div>
          <div className="filterMenu">
            <div className="filterTitle">Language</div>
          </div>
          <div className="filterMenu">
            <div className="filterTitle">Date Range</div>
          </div>
          <div className="displayContainer">
            <span className="displayTitle">Display As: </span>
            <select>
              <option value="summary">Summary</option>
              <option value="all">Most Helpful</option>
              <option value="recent">Recent</option>
              <option value="funny">Funny</option>
            </select>
          </div>
          <div className="graphContainer">
            <span className="graphBar">
              <span className="graphTitle">Show Graph</span>
              <div className="dblDwnArrow"></div>
            </span>
          </div>
        </div>
        <div className="filterListContainer">
          <div className="filterList">
            <div className="filterListTitle">Filters</div>
            <div className="activeFilter">Your Languages</div>
          </div>
          <div className="filterOverviewContainer">
            <div className="filterOverviewBar">
              <span className="filterOverview">Showing <b> {this.state.reviews.length} </b> reviews that match the filters above (
                <span className="filterPosOrNeg"> {this.state.overallPosOrNeg}
                 </span>
              )</span>
            </div>
          </div>
        </div>
        <div className="reviewsContainer">
          <div className="reviewsMainHeader">Most Helpful Reviews <span className="reviewsSubtleHeader">In the past 30 days</span></div>
          {this.state.reviews.map((rev) => {
            return <Reviews key={rev.id} review={rev} />
          })}
        </div>
      </div>

/* below code was for CSS Modules - which aren't being used for SSR */
      // <div>
      //   <h2>CUSTOMER REVIEWS</h2>
      //   <div className={style.statContainer}>
      //     <div className={style.statBar}>
      //       <div className={style.summary}>
      //         <div className={style.title}>Overall Reviews:</div>
      //         <span className={style.posOrNeg}> {this.state.overallPosOrNeg} </span>
      //         <span className={style.numOfRevs}>({this.state.reviews.length} reviews)</span>
      //       </div>
      //     </div>
      //     <div className={style.statBar}>
      //       <div className={style.summary}>
      //         <div className={style.title}>Recent Reviews:</div>
      //         <span className={style.posOrNeg}> {this.state.recentPosOrNeg} </span>
      //         <span className={style.numOfRevs}>({this.state.recent.length} reviews)</span>
      //       </div>
      //     </div>
      //   </div>
      //   <div className={style.filterContainer}>
      //     <div className={style.filterMenu}>
      //       <div className={style.filterTitle}>Review Type</div>
      //     </div>
      //     <div className={style.filterMenu}>
      //       <div className={style.filterTitle}>Purchase Type</div>
      //     </div>
      //     <div className={style.filterMenu}>
      //       <div className={style.filterTitle}>Language</div>
      //     </div>
      //     <div className={style.filterMenu}>
      //       <div className={style.filterTitle}>Date Range</div>
      //     </div>
      //     <div className={style.displayContainer}>
      //       <span className={style.displayTitle}>Display As: </span>
      //       <select>
      //         <option value="summary">Summary</option>
      //         <option value="all">Most Helpful</option>
      //         <option value="recent">Recent</option>
      //         <option value="funny">Funny</option>
      //       </select>
      //     </div>
      //     <div className={style.graphContainer}>
      //       <span className={style.graphBar}>
      //         <span className={style.graphTitle}>Show Graph</span>
      //         <div className={style.dblDwnArrow}></div>
      //       </span>
      //     </div>
      //   </div>
      //   <div className={style.filterListContainer}>
      //     <div className={style.filterList}>
      //       <div className={style.filterListTitle}>Filters</div>
      //       <div className={style.activeFilter}>Your Languages</div>
      //     </div>
      //     <div className={style.filterOverviewContainer}>
      //       <div className={style.filterOverviewBar}>
      //         <span className={style.filterOverview}>Showing <b> {this.state.reviews.length} </b> reviews that match the filters above (
      //           <span className={style.filterPosOrNeg}> {this.state.overallPosOrNeg}
      //            </span>
      //         )</span>
      //       </div>
      //     </div>
      //   </div>
      //   <div className={style.reviewsContainer}>
      //     <div className={style.reviewsMainHeader}>Most Helpful Reviews <span className={style.reviewsSubtleHeader}>In the past 30 days</span></div>
      //     {this.state.reviews.map((rev) => {
      //       return <Reviews key={rev.id} review={rev} />
      //     })}
      //   </div>
      // </div>
    );
  }
};


export default App;
