import React from "react";
import useStyles from "../styles/createMarketDesign";
import {
  Paper,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@material-ui/core";

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
                fontWeight: "600",
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
            Initial Liquidity (Tez)
          </h5>
          <TextField
            id="outlined"
            style={{ width: "55%" }}
            placeholder="Initial liquidity for the market in tez"
            variant="outlined"
            InputProps={{
              className: classes.placeholder,
              classes: {
                notchedOutline: classes.outline,
              },
              endAdornment: (
                <InputAdornment
                  position="end"
                >
                  <Typography style={{color:"white"}}>Tez</Typography>
                </InputAdornment>
              ),
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
          <Button
            variant="contained"
            color="primary"
            style={{
              margin: "20px 0px 20px 0px",
              width: "100%",
              backgroundColor: "#F48FB1",
            }}
          >
            Approve Market
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default CreateMarket;
