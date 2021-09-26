import React from "react";
import { Paper } from "@material-ui/core";
import useStyles from "../styles/homePageDesign.jsx";
import { Link } from "react-router-dom";
function Market({ marketData }) {
  const classes = useStyles();
  return (
    <div
      style={{
        cursor: "pointer",
      }}
    >
      <Link
        to={`/market/${marketData.questionId}`}
        style={{ textDecoration: "none" }}
      >
        <Paper className={classes.markets}>
          <div className={classes.marketRow}>
            <img
              src={
                "https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-645x645.jpg"
              }
              alt="market"
              className={classes.image}
            />
            {marketData.question}
          </div>
          <div className={classes.marketBottomRow}>
            <div className={classes.marketBottomColumn}>
              Ends on
              <Paper className={classes.price}>{`${marketData.startDate
                .toDate()
                .toDateString()
                .slice(4)}`}</Paper>
            </div>
            <div className={classes.marketBottomColumn}>
              Yes
              <Paper className={classes.price}>{`$${0.54} Tez`}</Paper>
            </div>
            <div className={classes.marketBottomColumn}>
              No
              <Paper className={classes.price}>{`$${0.46} Tez`}</Paper>
            </div>
          </div>
        </Paper>
      </Link>
    </div>
  );
}

export default Market;
