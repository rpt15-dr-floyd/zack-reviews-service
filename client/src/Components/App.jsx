import React from 'react';
import axios from 'axios';
import isPosOrNeg from '../utils/utilities.js';
import Reviews from './Reviews.jsx';
import style from '../Styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // gameId: window.location.pathname.split('/')[1],
      gameId: 1,
      reviews: [],
      overallPosOrNeg: '',
      recentPosOrNeg: '',
      recent: []
    };
  }

  componentDidMount () {
    axios.get(`http://localhost:3001/api/reviews/${this.state.gameId}`)
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
        <div className={style.statContainer}>
          <div className={style.statBar}>
            <div className={style.summary}>
              <div className={style.title}>Overall Reviews:</div>
              <span className={style.posOrNeg}> {this.state.overallPosOrNeg} </span>
              <span className={style.numOfRevs}>({this.state.reviews.length} reviews)</span>
              {/* <a class="tooltip">{this.state.posOrNeg}</a> */}
            </div>
          </div>
          <div className={style.statBar}>
            <div className={style.summary}>
              <div className={style.title}>Recent Reviews:</div>
              <span className={style.posOrNeg}> {this.state.recentPosOrNeg} </span>
              <span className={style.numOfRevs}>({this.state.recent.length} reviews)</span>
              {/* <a class="tooltip">{something}</a> */}
            </div>
          </div>
        </div>
        <div className={style.filterContainer}>
          <div className={style.filterMenu}>
            <div className={style.filterTitle}>Review Type</div>
          </div>
          <div className={style.filterMenu}>
            <div className={style.filterTitle}>Purchase Type</div>
          </div>
          <div className={style.filterMenu}>
            <div className={style.filterTitle}>Language</div>
          </div>
          <div className={style.filterMenu}>
            <div className={style.filterTitle}>Date Range</div>
          </div>
          <div className={style.displayContainer}>
            <span className={style.displayTitle}>Display As: </span>
            <select>
              <option value="summary">Summary</option>
              <option value="all">Most Helpful</option>
              <option value="recent">Recent</option>
              <option value="funny">Funny</option>
            </select>
          </div>
          <div className={style.graphContainer}>
            <span className={style.graphBar}>
              <span className={style.graphTitle}>Show Graph</span>
              <div className={style.dblDwnArrow}></div>
            </span>
          </div>
        </div>
        <div className={style.filterListContainer}>
          <div className={style.filterList}>
            <div className={style.filterListTitle}>Filters</div>
            <div className={style.activeFilter}>Your Languages</div>
          </div>
          <div className={style.filterOverviewContainer}>
            <div className={style.filterOverviewBar}>
              <span className={style.filterOverview}>Showing <b> {this.state.reviews.length} </b> reviews that match the filters above (
                <span className={style.filterPosOrNeg}> {this.state.overallPosOrNeg}
                 </span>
              )</span>
            </div>
          </div>
        </div>
        <div className={style.reviewsContainer}>
          <div className={style.reviewsMainHeader}>Most Helpful Reviews <span className={style.reviewsSubtleHeader}>In the past 30 days</span></div>
          {this.state.reviews.map((rev) => {
            return <Reviews key={rev._id} review={rev} />
          })}
        </div>
      </div>
    );
  }
};

export default App;
