import React, { useState } from "react";
import useStyles from "../styles/createMarketDesign";
import {
  Paper,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QontoStepIcon } from "./stepper.jsx";

function CreateMarket(props) {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [question, setQuestion] = useState("");
  const [marketDescription, setMarketDescription] = useState("");
  const [oracle, setOracle] = useState(props.address);
  const [tez, setTez] = useState("");
  const contractJSONfile = require("../contract.json");
  const [index, setIndex] = useState(0);
  const steps = ["Deploy market contract", "Provide initial liquidity"];

  const handleDeploy = (e) => {
    e.preventDefault();
    if (!startDate) {
      toast.error("Select a valid date", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (question && oracle && marketDescription) {
      setIndex(1);
      /*       Tezos.wallet
        .originate({
          code: contractJSONfile,
          storage: {
            stored_counter: 0,
            threshold: 1,
            keys: ["edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"],
          },
        })
        .send()
        .then((originationOp) => {
          console.log(`Waiting for confirmation of origination...`);
          return originationOp.contract();
        })
        .then((contract) => {
          console.log(`Origination completed for ${contract.address}.`);
        })
        .catch((error) =>
          console.log(`Error: ${JSON.stringify(error, null, 2)}`)
        ); */
    } else {
      toast.error("Enter valid info", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={classes.CreateMarket}>
      <Paper className={classes.paper}>
        <h3 style={{ color: "#F48FB1" }}>Create a new market</h3>
        <div style={{ height: "10px" }}></div>
        <Stepper
          alternativeLabel
          activeStep={index}
          style={{ backgroundColor: "transparent" }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ height: "10px" }}></div>
        {index === 0 ? (
          <form className={classes.form} onSubmit={handleDeploy}>
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
              required
              id="outlined"
              placeholder="What would you like to see this market predict?"
              fullWidth
              variant="outlined"
              onChange={(e) => setQuestion(e.target.value)}
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
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              customInput={
                <Paper className={classes.closingDate}>
                  <Typography
                    variant="subtitle2"
                    style={{
                      margin: "10px 40px 10px 40px",
                      cursor: "pointer",
                      color: !startDate ? "#6A676F" : "white",
                      fontWeight: "600",
                    }}
                  >
                    {!startDate
                      ? "Select Closing Date"
                      : startDate.toDateString().replace(/^\S+\s/, "")}
                  </Typography>
                </Paper>
              }
              withPortal
            />
            <div style={{ height: "20px" }}></div>
            <h5
              style={{
                color: "white",
                margin: "0px 0px 8px 0px",
                fontSize: "13px",
              }}
            >
              Market Description
            </h5>
            <TextField
              required
              id="outlined"
              placeholder="Description of the market"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              onChange={(e) => setMarketDescription(e.target.value)}
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
              Oracle Address
            </h5>
            <TextField
              id="outlined"
              required
              placeholder="Enter the address that will report the result of this market"
              fullWidth
              variant="outlined"
              defaultValue={oracle}
              onChange={(e) => setOracle(e.target.value)}
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
              type="submit"
              style={{
                margin: "20px 0px 20px 0px",
                width: "100%",
                backgroundColor: "#F48FB1",
              }}
            >
              Deploy market contract
            </Button>
          </form>
        ) : (
          <form className={classes.form}>
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
              type="number"
              required
              error={
                tez
                  ? parseFloat(tez) >= 1.0 &&
                    parseFloat(tez) <= (props.balance / 1000000).toFixed(3)
                    ? false
                    : true
                  : false
              }
              helperText={
                tez
                  ? parseFloat(tez) >= 1.0 &&
                    parseFloat(tez) <= (props.balance / 1000000).toFixed(3)
                    ? ""
                    : `Must be greater than 1.0 Tez and less than ${(
                        props.balance / 1000000
                      ).toFixed(3)} Tez`
                  : ""
              }
              style={{ width: "55%" }}
              placeholder="Initial liquidity for the market in tez"
              variant="outlined"
              onChange={(e) => setTez(e.target.value)}
              InputProps={{
                className: classes.placeholder,
                classes: {
                  notchedOutline: classes.outline,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography style={{ color: "white" }}>Tez</Typography>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#ffffff", textOverflow: "ellipsis" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{
                margin: "20px 0px 20px 0px",
                width: "100%",
                backgroundColor: "#F48FB1",
              }}
            >
              Initialize market
            </Button>
          </form>
        )}
      </Paper>
      <ToastContainer />
    </div>
  );
}

export default CreateMarket;
