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
import BounceLoader from "react-spinners/BounceLoader";
import db from "../firebase";

/**
 * @param {{Tezos: TezosToolkit}}
 */
function CreateMarket({ address, Tezos, balance }) {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [question, setQuestion] = useState("");
  const [marketDescription, setMarketDescription] = useState("");
  const [oracle, setOracle] = useState(address);
  const [tez, setTez] = useState("");
  const contractJSONfile = require("../contract.json");
  const [index, setIndex] = useState(0);
  const steps = ["Deploy market contract", "Provide initial liquidity"];
  const [contractAddress, setContactAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
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
      setLoading(true);
      setLoadingText("Deploying market contract...");
      const rand = Math.floor(100000 + Math.random() * 900000);
      Tezos.wallet
        .originate({
          code: contractJSONfile,
          init: `(Pair (Pair (Pair {} (Pair "${startDate.toISOString()}" 0)) (Pair (Pair False False) (Pair {} 0))) (Pair (Pair 0 (Pair "${oracle}" "${rand.toString()}")) (Pair (Pair 0 0) (Pair 0 0))))`,
        })
        .send()
        .then((originationOp) => {
          console.log(`Waiting for confirmation of origination...`);
          setLoadingText("Waiting for confirmation of origination...");
          return originationOp.contract();
        })
        .then((contract) => {
          console.log(`Origination completed for ${contract.address}.`);
          setLoadingText("");
          setContactAddress(contract.address);
          setIndex(1);
          setLoading(false);
          db.collection("markets").doc(contract.address).set({
            contractAddress: contract.address,
            question: question,
            marketDescription: marketDescription,
            questionId: rand.toString(),
            oracle: oracle,
            startDate: startDate,
            createdAt: Date.now(),
          });
          toast.success("🦄 Contract successfully deployed", {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong", {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoading(false);
        });
    } else {
      toast.error("Enter valid info", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const handleLiquidity = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Providing liquidity...");
    Tezos.wallet
      .at(contractAddress)
      .then((contract) =>
        contract.methods
          .initializeMarket([["unit"]])
          .send({ amount: parseFloat(tez), mutez: false })
      )
      .then((op) => {
        console.log(`Hash: ${op.opHash}`);
        setLoadingText(
          `Got the Hash: ${op.opHash},\n waiting for confirmation`
        );
        return op.confirmation();
      })
      .then((result) => {
        console.log(result);
        if (result.completed) {
          setLoadingText(`Transaction correctly processed!`);
          toast.success("🦄 Market initialized successfully", {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoading(false);
          setLoadingText("");
        } else {
          console.log("An error has occurred");
          toast.error("Something went wrong", {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoading(false);
          setLoadingText("");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoading(false);
        setLoadingText("");
      });
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <BounceLoader color="#9282EC" loading={loading} size={100} />
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
          {loadingText}
        </Typography>
      </div>
    );
  }
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
              defaultValue={question}
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
              defaultValue={marketDescription}
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
          <form className={classes.form} onSubmit={handleLiquidity}>
            <h5
              style={{
                color: "white",
                margin: "0px 0px 8px 0px",
                fontSize: "13px",
              }}
            >
              Contract address
            </h5>
            <TextField
              id="outlined"
              fullWidth
              disabled
              variant="outlined"
              defaultValue={contractAddress}
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
              Initial Liquidity (Tez)
            </h5>
            <TextField
              id="outlined"
              type="number"
              required
              error={
                tez
                  ? parseFloat(tez) >= 1.0 &&
                    parseFloat(tez) <= (balance / 1000000).toFixed(3)
                    ? false
                    : true
                  : false
              }
              helperText={
                tez
                  ? parseFloat(tez) >= 1.0 &&
                    parseFloat(tez) <= (balance / 1000000).toFixed(3)
                    ? ""
                    : `Must be greater than 1.0 Tez and less than ${(
                        balance / 1000000
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
