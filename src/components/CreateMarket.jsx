import React from "react";
import useStyles from "../styles/createMarketDesign";
import { Paper, TextField, Typography } from "@material-ui/core";

function CreateMarket() {
  const classes = useStyles();
  return (
    <div className={classes.CreateMarket}>
      <Paper className={classes.paper}>
        <h3 style={{ color: "#F48FB1" }}>Create a new market</h3>
        <form className={classes.form}>
          <h5
            style={{
              color: "white",
              margin: "0px 0px 8px 0px",
              fontSize: "13px",
            }}
          >
            Market Question
          </h5>
          <TextField
            id="outlined"
            placeholder="What would you like to see this market predict?"
            fullWidth
            variant="outlined"
            InputProps={{
              className: classes.placeholder,
              classes: {
                notchedOutline: classes.outline,
              },
            }}
            InputLabelProps={{
              style: { color: "#ffffff", textOverflow: "ellipsis" },
            }}
          />
          <div style={{ height: "20px" }}></div>
          <h5
            style={{
              color: "white",
              margin: "0px 0px 8px 0px",
              fontSize: "13px",
            }}
          >
            Closing Date - UTC
          </h5>
          <Paper className={classes.closingDate}>
            <Typography
              variant="subtitle1"
              style={{
                margin: "10px 40px 10px 40px",
                cursor: "pointer",
                color: "#6A676F",
                fontWeight: "600"
              }}
            >
              Select Closing Date
            </Typography>
          </Paper>
          <div style={{ height: "20px" }}></div>
          <h5
            style={{
              color: "white",
              margin: "0px 0px 8px 0px",
              fontSize: "13px",
            }}
          >
            Oracle Address
          </h5>
          <TextField
            id="outlined"
            placeholder="Enter the address that will report the result of this market"
            fullWidth
            variant="outlined"
            InputProps={{
              className: classes.placeholder,
              classes: {
                notchedOutline: classes.outline,
              },
            }}
            InputLabelProps={{
              style: { color: "#ffffff", textOverflow: "ellipsis" },
            }}
          />
        </form>
      </Paper>
    </div>
  );
}

export default CreateMarket;
