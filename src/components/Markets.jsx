import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import db from "../firebase";
import useStyles from "../styles/homePageDesign.jsx";
import Market from "./Market";
import { Typography, Grid } from "@material-ui/core";
import BounceLoader from "react-spinners/BounceLoader";

function Markets() {
  const classes = useStyles();
  const [markets, setMarkets] = useState([]);
  useEffect(() => {
    console.log("Hi");
    db.collection("markets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) =>
        setMarkets(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);
  //console.log(markets);
  return (
    <div>
      <Typography variant="h6" className={classes.popularMarketText}>
        Markets
      </Typography>
      {markets.length !== 0 ? (
        <Grid container spacing={4}>
          {markets.map((market, index) => (
            <Grid item xs={12} sm={6} lg={4} xl={4} key={index}>
              <Market marketData={market} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>
          <div className={classes.loading}>
            <BounceLoader color="#9282EC" loading={true} size={100} />
            <div style={{ height: "15px" }}></div>
            <Typography
              variant="subtitle2"
              style={{
                margin: "10px 40px 10px 40px",
                cursor: "pointer",
                color: "white",
                fontWeight: "600",
              }}
            >
              Loading.....
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}

export default Markets;
