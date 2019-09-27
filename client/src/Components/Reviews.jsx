import React from 'react';
import style from '../Styles/Reviews.css';

class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toRecOrNot: '',
      toRecOrNotImg: ''
    };
  }

  componentDidMount() {
    this.decideToRecOrNot();
  }

  decideToRecOrNot() {
    if (this.props.review.recommended) {
      this.setState({
        toRecOrNot: 'Recommended',
        toRecOrNotImg: 'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsUp_v6.png'
      });
    } else {
      this.setState({
        toRecOrNot: 'Not Recommended',
        toRecOrNotImg: 'https://steamcommunity-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsDown.png?v=1'
      });
    }
  }

  render() {
    return (
      <div className={style.reviewContainer}>
        <div className={style.reviewBox}>
          <div className={style.authorContainer}>
            <div className={style.avatarContainer}>
              <div className={style.avatarBox}>
                <img className={style.avatarImg} src={this.props.review.userPhoto}></img>
              </div>
            </div>
            <div className={style.authorName}> {this.props.review.author} </div>
            <div className={style.numOfGames}>{this.props.review.numOfGames} products in account</div>
            <div className={style.numOfRevs}>{this.props.review.numOfReviews} reviews</div>
          </div>
          <div className={style.summaryContainer}>
            <div className={style.recContainer}>
              <div className={style.recImgContainer}>
                <img className={style.recImg} src={this.state.toRecOrNotImg}></img>
              </div>
              <img className={style.logoImg} src="https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_steam.png"></img>
              <div className={style.recOrNot}>{this.state.toRecOrNot}</div>
              <div className={style.hours}>{this.props.review.recordHours} hrs on record</div>
            </div>
            <div className={style.posted}>Posted: {
              this.props.review.posted /* conditional - if posted property exists */
              ? this.props.review.posted.substring(4, 10)
              : "Unknown Post Date"
              }</div>
            <div className={style.content}>{this.props.review.body}</div>
            <div className={style.space}></div>
            <div className={style.line}></div>
            <div className={style.helpfulContainer}>
              <span className={style.text}>Was this review helpful?</span>
              <div className={style.yesContainer}>
                <span className={style.yes}>
                  <img className={style.yesImg}></img>
                  Yes
                </span>
              </div>
              <div className={style.yesContainer}>
                <span className={style.yes}>
                  <img className={style.noImg}></img>
                  No
                </span>
              </div>
              <div className={style.yesContainer}>
                <span className={style.yes}>
                  <img className={style.funnyImg}></img>
                  Funny
                </span>
              </div>
            </div>
            <div className={style.voteInfo}>
              {this.props.review.helpful} people found this review helpful
              <br></br>
              {this.props.review.unhelpful} people found this review unhelpful
              <br></br>
              {this.props.review.funny} people found this review funny
              <div className={style.commentsContainer}>
                <div className={style.comments}> {this.props.review.comments} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Reviews;
