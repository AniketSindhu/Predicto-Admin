import React, { useState, useEffect } from "react";
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
      .where("resolved", "==", false)
      .onSnapshot((snapshot) =>
        setMarkets(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);
  //console.log(markets);
  return (
    <div>
      <Typography variant="h6" className={classes.popularMarketText}>
        Live Markets
      </Typography>
      <Grid container spacing={4}>
        {markets.length !== 0 ? (
          markets.map((market, index) => (
            <Grid item xs={12} sm={6} lg={4} xl={4} key={index}>
              <Market marketData={market} />
            </Grid>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </Grid>
    </div>
  );
}

export default Markets;
