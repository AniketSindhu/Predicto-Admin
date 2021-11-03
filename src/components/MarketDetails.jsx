import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Paper,
  Tab,
  Tabs,
  Typography,
  InputBase,
  Button,
} from "@material-ui/core";
import useStyles2 from "../styles/marketDetails.jsx";
import { Doughnut } from "react-chartjs-2";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import db from "../firebase";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Countdown from "react-countdown";

/**
 * @param {{Tezos: TezosToolkit}}
 */
function MarketDetails({
  Tezos,
  address,
  balance,
  userAddress,
  updateBalance,
}) {
  const classes = useStyles2();
  const theme = createTheme({
    palette: {},
  });
  const [market, setMarket] = useState(null);
  const [outcomeBalance, setOutcomeBalance] = useState({
    yes: 0,
    no: 0,
  });
  const [marketDataContract, setMarketDataContract] = useState(null);
  const [value, setValue] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const [howMuch, setHowMuch] = useState("");
  const [estShare, setEstShare] = useState(0);
  const [noTokensGet, setNoTokensGet] = useState(0);
  const [yesTokensGet, setYesTokensGet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [liquidityBalance, setLiquidityBalance] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");

  const handleChangeTabs = (event, newValue) => {
    setEstShare(0);
    setHowMuch("");
    setNoTokensGet(0);
    setYesTokensGet(0);
    setValue(newValue);
  };

  const handleChangeOutcome = (event, outcome) => {
    if (outcome !== null) {
      setOutcome(outcome);
    }
  };

  const handleChangeLiquidityRemove = (event) => {
    event.preventDefault();
    setHowMuch(parseFloat(event.target.value));
    var howMuchNow1 = parseFloat(event.target.value);
    var factor =
      parseFloat(marketDataContract.totalLiquidityShares * 1000) /
      (howMuchNow1 * 1000000);
    if (
      parseFloat(marketDataContract.yesPool) >
      parseFloat(marketDataContract.noPool)
    ) {
      var tezToSend = parseFloat(marketDataContract.noPool * 1000) / factor;
      var yesToSend =
        parseFloat(marketDataContract.yesPool * 1000) / factor - tezToSend;
      setYesTokensGet(yesToSend);
      setEstShare(tezToSend);
      setNoTokensGet(0);
    } else if (
      parseFloat(marketDataContract.noPool) >
      parseFloat(marketDataContract.yesPool)
    ) {
      var tezToSend1 = parseFloat(marketDataContract.yesPool * 1000) / factor;
      var noToSend =
        parseFloat(marketDataContract.noPool * 1000) / factor - tezToSend1;
      setYesTokensGet(0);
      setEstShare(tezToSend1);
      setNoTokensGet(noToSend);
    } else {
      setNoTokensGet(0);
      setYesTokensGet(0);
      setEstShare(howMuchNow1 * 1000000);
    }
  };

  const handleChangeLiquidityAdd = (event) => {
    event.preventDefault();
    setHowMuch(parseFloat(event.target.value));
    var howMuchNow1 = parseFloat(event.target.value);
    if (
      parseFloat(marketDataContract.yesPool) >
      parseFloat(marketDataContract.noPool)
    ) {
      var ratio =
        parseFloat(marketDataContract.yesPool) /
        parseFloat(marketDataContract.noPool);
      var noTokens = howMuchNow1 - howMuchNow1 / ratio;
      setNoTokensGet(noTokens);
      setYesTokensGet(0);
      var yesPerShare =
        (parseFloat(marketDataContract.yesPool) * 1000) /
        parseFloat(marketDataContract.totalLiquidityShares);
      var sharePurchased = (howMuchNow1 * 1000 * 1000000) / yesPerShare;
      setEstShare(sharePurchased);
    } else if (
      parseFloat(marketDataContract.noPool) >
      parseFloat(marketDataContract.yesPool)
    ) {
      var ratio1 =
        parseFloat(marketDataContract.noPool) /
        parseFloat(marketDataContract.yesPool);
      var yesTokens = howMuchNow1 - howMuchNow1 / ratio1;
      setYesTokensGet(yesTokens);
      setNoTokensGet(0);
      var noPerShare =
        (parseFloat(marketDataContract.noPool) * 1000) /
        parseFloat(marketDataContract.totalLiquidityShares);
      var sharePurchased1 = (howMuchNow1 * 1000 * 1000000) / noPerShare;
      setEstShare(sharePurchased1);
    } else {
      setNoTokensGet(0);
      setYesTokensGet(0);
      setEstShare(howMuchNow1 * 1000000);
    }
  };

  const getBalances = async () => {
    axios
      .get(
        `https://api.granadanet.tzkt.io/v1/contracts/${address}/bigmaps/balances/keys/${userAddress}`
      )
      .then((response) => {
        if (response.data) {
          setOutcomeBalance(response.data.value);
        } else {
          setOutcomeBalance({
            yes: 0,
            no: 0,
          });
        }
      })
      .catch((err) => {
        setOutcomeBalance({
          yes: 0,
          no: 0,
        });
      });
    axios
      .get(
        `https://api.granadanet.tzkt.io/v1/contracts/${address}/bigmaps/liquidityBalance/keys/${userAddress}`
      )
      .then((response) => {
        if (response.data) {
          setLiquidityBalance(response.data.value);
        } else {
          setLiquidityBalance(0);
        }
      })
      .catch((err) => {
        setLiquidityBalance(0);
      });
  };

  const addLiquidity = (e) => {
    e.preventDefault();
    if (parseFloat(howMuch) > parseFloat(balance / 1000000)) {
      toast.error("Insufficient balance", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    } else {
      setLoading(true);
      setLoadingText("Adding Liquidity....");
      Tezos.wallet.at(address).then((contract) => {
        contract.methods
          .addLiquidity([["unit"]])
          .send({ amount: parseFloat(howMuch), mutez: false })
          .then((op) => {
            console.log(`Hash: ${op.opHash}`);
            setLoadingText(`Waiting for confirmation`);
            return op.confirmation();
          })
          .then((result) => {
            console.log(result);
            if (result.completed) {
              setLoadingText(`Getting new Market Data`);
              axios
                .get(
                  `https://api.granadanet.tzkt.io/v1/contracts/${address}/storage/`
                )
                .then((response) => {
                  toast.success("🦄 Transaction successfull", {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  updateBalance();
                  getBalances();
                  setMarketDataContract(response.data);
                  setLoading(false);
                  setLoadingText("");
                  setHowMuch(0);
                  setEstShare(0);
                  setNoTokensGet(0);
                  setYesTokensGet(0);
                });
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
      });
    }
  };

  const removeLiquidity = (e) => {
    e.preventDefault();
    if (parseFloat(howMuch) > parseFloat(liquidityBalance / 1000000)) {
      toast.error("Insufficient balance", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    } else {
      setLoading(true);
      setLoadingText("Removing Liquidity....");
      Tezos.wallet.at(address).then((contract) => {
        contract.methods
          .removeLiquidity(parseFloat(howMuch) * 1000000)
          .send()
          .then((op) => {
            console.log(`Hash: ${op.opHash}`);
            setLoadingText(`Waiting for confirmation`);
            return op.confirmation();
          })
          .then((result) => {
            console.log(result);
            if (result.completed) {
              setLoadingText(`Getting new Market Data`);
              axios
                .get(
                  `https://api.granadanet.tzkt.io/v1/contracts/${address}/storage/`
                )
                .then((response) => {
                  toast.success("🦄 Transaction successfull", {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  updateBalance();
                  getBalances();
                  setMarketDataContract(response.data);
                  setLoading(false);
                  setLoadingText("");
                  setHowMuch(0);
                  setEstShare(0);
                  setNoTokensGet(0);
                  setYesTokensGet(0);
                });
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
      });
    }
  };

  const resolveMarket = (e) => {
    e.preventDefault();
    if (market.startDate.toDate() > new Date()) {
      toast.error("Cant resolve before the end date", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    } else {
      setLoading(true);
      setLoadingText("Resolving Market....");
      Tezos.wallet.at(address).then((contract) => {
        contract.methods
          .resolveMarket(outcome === 0)
          .send()
          .then((op) => {
            console.log(`Hash: ${op.opHash}`);
            setLoadingText(`Waiting for confirmation`);
            return op.confirmation();
          })
          .then((result) => {
            console.log(result);
            if (result.completed) {
              setLoadingText(`Getting new Market Data`);
              axios
                .get(
                  `https://api.granadanet.tzkt.io/v1/contracts/${address}/storage/`
                )
                .then((response) => {
                  toast.success("🦄 Transaction successfull", {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  db.collection("markets")
                    .doc(address)
                    .update({ resolved: true });
                  updateBalance();
                  getBalances();
                  setMarketDataContract(response.data);
                  setLoading(false);
                  setLoadingText("");
                  setHowMuch(0);
                  setEstShare(0);
                  setNoTokensGet(0);
                  setYesTokensGet(0);
                });
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
      });
    }
  };

  useEffect(() => {
    console.log(address);
    db.collection("markets")
      .doc(address)
      .get()
      .then((doc) => {
        setMarket(doc.data());
      });
    axios
      .get(`https://api.granadanet.tzkt.io/v1/contracts/${address}/storage/`)
      .then((response) => {
        setMarketDataContract(response.data);
      });
    axios
      .get(
        `https://api.granadanet.tzkt.io/v1/contracts/${address}/bigmaps/balances/keys/${userAddress}`
      )
      .then((response) => {
        if (response.data) {
          setOutcomeBalance(response.data.value);
        } else {
          setOutcomeBalance({
            yes: 0,
            no: 0,
          });
        }
      })
      .catch((err) => {
        setOutcomeBalance({
          yes: 0,
          no: 0,
        });
      });
    axios
      .get(
        `https://api.granadanet.tzkt.io/v1/contracts/${address}/bigmaps/liquidityBalance/keys/${userAddress}`
      )
      .then((response) => {
        if (response.data) {
          setLiquidityBalance(response.data.value);
        } else {
          setLiquidityBalance(0);
        }
      })
      .catch((err) => {
        setLiquidityBalance(0);
      });
  }, [address, userAddress]);
  if (marketDataContract && market && loading === false) {
    return (
      <div className={classes.body}>
        <Paper className={classes.header} elevation={5}>
          <div className={classes.topRow}>
            <img
              className={classes.image}
              src={
                "https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-645x645.jpg"
              }
              alt="logo"
            />
            <h4 className={classes.questionText}>{market.question}</h4>
          </div>
          <div className={classes.marketBottomRow}>
            <div className={classes.marketBottomColumn}>
              Ends on
              <Paper className={classes.price}>{`${market.startDate
                .toDate()
                .toDateString()
                .slice(4)}`}</Paper>
            </div>
            <div className={classes.marketBottomColumn}>
              Yes Balance
              <Paper className={classes.price}>
                {(parseFloat(outcomeBalance.yes) / 10 ** 6).toFixed(2)} Yes
              </Paper>
            </div>
            <div className={classes.marketBottomColumn}>
              No Balance
              <Paper className={classes.price}>
                {(parseFloat(outcomeBalance.no) / 10 ** 6).toFixed(2)} No
              </Paper>
            </div>
            <div className={classes.marketBottomColumn}>
              Liquidity Balance
              <Paper className={classes.price}>
                {(parseFloat(liquidityBalance) / 10 ** 6).toFixed(2)}
              </Paper>
            </div>
          </div>
        </Paper>
        <div className={classes.row}>
          <Paper className={classes.chart}>
            <Doughnut
              data={{
                hoverOffset: 4,

                labels: ["Yes", "No"],
                datasets: [
                  {
                    data: [
                      marketDataContract.yesPrice / 1000,
                      marketDataContract.noPrice / 1000,
                    ],
                    backgroundColor: ["#06D6A0", "#FF6978"],
                    hoverBackgroundColor: ["#05AC7F", "#D45D69"],
                    borderColor: "#fff",
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                    hoverBorderColor: "#fff",
                  },
                ],
              }}
              options={{
                animation: {
                  animateRotate: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    padding: 20,
                    position: "bottom",
                    fullSize: true,
                    maxWidth: true,
                    dispaly: false,
                    labels: {
                      color: "#fff",
                      padding: 20,
                    },
                  },
                  title: {
                    display: true,
                    text: "Market Probablity Chart",
                    color: "#fff",
                    font: {
                      weight: "bold",
                      size: 18,
                    },
                    padding: {
                      bottom: 30,
                    },
                    fontSize: "20px",
                    fullSize: true,
                  },
                },
              }}
            />
          </Paper>
          <Paper className={classes.rightSection}>
            <MuiThemeProvider theme={theme}>
              <Tabs
                value={value}
                onChange={handleChangeTabs}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#F48FB1",
                    color: "white",
                  },
                }}
                className={classes.tabs}
                centered
              >
                <Tab label="Add Liquidity" />
                <Tab label="Remove Liquidity" />
                <Tab label="Resolve Market" />
              </Tabs>
            </MuiThemeProvider>
            {value === 0 &&
              (!market.resolved ? (
                <form onSubmit={addLiquidity}>
                  <div className={classes.tabContent}>
                    <Typography
                      variant={"body1"}
                      className={classes.text}
                      style={{ fontWeight: 700, fontSize: "18px" }}
                    >
                      How much?
                    </Typography>
                    <div
                      className={classes.rowInput}
                      style={{
                        marginBottom: howMuch
                          ? howMuch < 1
                            ? "2px"
                            : "10px"
                          : "10px",
                      }}
                    >
                      <InputBase
                        className={classes.input}
                        style={{
                          border: howMuch
                            ? howMuch < 1
                              ? "1px solid red"
                              : howMuch > balance / 10 ** 6
                              ? "1px solid red"
                              : "1px solid #9282EC"
                            : "1px solid #9282EC",
                        }}
                        placeholder="0"
                        variant="filled"
                        value={howMuch}
                        type="number"
                        onChange={handleChangeLiquidityAdd}
                        error={
                          howMuch
                            ? howMuch < 1
                              ? true
                              : howMuch > balance / 10 ** 6
                              ? true
                              : false
                            : false
                        }
                      ></InputBase>
                      <Typography variant={"body1"} className={classes.usdText}>
                        Tez
                      </Typography>
                    </div>
                    {howMuch ? (
                      howMuch < 1 ? (
                        <Typography
                          variant={"body1"}
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginLeft: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          Cant be less than 1 tez
                        </Typography>
                      ) : howMuch > balance / 10 ** 6 ? (
                        <Typography
                          variant={"body1"}
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginLeft: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          Cannot be more than your balance
                        </Typography>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                    <Typography
                      variant={"body1"}
                      className={classes.text}
                      style={{ fontWeight: 700, fontSize: "18px" }}
                    >
                      You'll get:
                    </Typography>
                    <div className={classes.rowBottom}>
                      <Typography
                        variant={"body1"}
                        className={classes.bottomtextLeft}
                      >
                        Liquidity Shares
                      </Typography>
                      <Typography variant={"h6"} className={classes.bottomText}>
                        {estShare
                          ? parseFloat(estShare / 1000000).toFixed(2)
                          : 0}
                      </Typography>
                    </div>
                    <div className={classes.rowBottom}>
                      <Typography
                        variant={"body1"}
                        className={classes.bottomtextLeft}
                      >
                        Yes Shares
                      </Typography>
                      <Typography variant={"h6"} className={classes.bottomText}>
                        {yesTokensGet ? parseFloat(yesTokensGet).toFixed(2) : 0}{" "}
                        Yes
                      </Typography>
                    </div>
                    <div className={classes.rowBottom}>
                      <Typography
                        variant={"body1"}
                        className={classes.bottomtextLeft}
                      >
                        No Shares
                      </Typography>
                      <Typography variant={"h6"} className={classes.bottomText}>
                        {noTokensGet ? parseFloat(noTokensGet).toFixed(2) : 0}{" "}
                        No
                      </Typography>
                    </div>
                    <div className={classes.buttonDiv}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.button}
                        fullWidth={true}
                      >
                        Add Liquidity
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <Typography variant={"body1"} className={classes.text}>
                  Market is resolved
                </Typography>
              ))}
            {value === 1 && (
              <form onSubmit={removeLiquidity}>
                <div className={classes.tabContent}>
                  <Typography
                    variant={"body1"}
                    className={classes.text}
                    style={{ fontWeight: 700, fontSize: "18px" }}
                  >
                    How much?
                  </Typography>
                  <div
                    className={classes.rowInput}
                    style={{
                      marginBottom: howMuch
                        ? howMuch < 0
                          ? "2px"
                          : "10px"
                        : "10px",
                    }}
                  >
                    <InputBase
                      className={classes.input}
                      style={{
                        border: howMuch
                          ? howMuch < 0
                            ? "1px solid red"
                            : howMuch > liquidityBalance / 10 ** 6
                            ? "1px solid red"
                            : "1px solid #9282EC"
                          : "1px solid #9282EC",
                      }}
                      placeholder="0"
                      variant="filled"
                      value={howMuch}
                      type="number"
                      onChange={handleChangeLiquidityRemove}
                      error={
                        howMuch
                          ? howMuch < 0
                            ? true
                            : howMuch > liquidityBalance / 10 ** 6
                            ? true
                            : false
                          : false
                      }
                    ></InputBase>
                    <Typography variant={"body1"} className={classes.usdText}>
                      Liquidity Shares
                    </Typography>
                  </div>
                  {howMuch ? (
                    howMuch < 0 ? (
                      <Typography
                        variant={"body1"}
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginLeft: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        Cant be less than 0
                      </Typography>
                    ) : howMuch > liquidityBalance / 10 ** 6 ? (
                      <Typography
                        variant={"body1"}
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginLeft: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        Cannot be more than your balance
                      </Typography>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                  <Typography
                    variant={"body1"}
                    className={classes.text}
                    style={{ fontWeight: 700, fontSize: "18px" }}
                  >
                    You'll get:
                  </Typography>
                  <div className={classes.rowBottom}>
                    <Typography
                      variant={"body1"}
                      className={classes.bottomtextLeft}
                    >
                      Tez
                    </Typography>
                    <Typography variant={"h6"} className={classes.bottomText}>
                      {estShare ? parseFloat(estShare / 1000000).toFixed(2) : 0}{" "}
                      Tez
                    </Typography>
                  </div>
                  <div className={classes.rowBottom}>
                    <Typography
                      variant={"body1"}
                      className={classes.bottomtextLeft}
                    >
                      Yes Shares
                    </Typography>
                    <Typography variant={"h6"} className={classes.bottomText}>
                      {yesTokensGet
                        ? parseFloat(yesTokensGet / 1000000).toFixed(2)
                        : 0}{" "}
                      Yes
                    </Typography>
                  </div>
                  <div className={classes.rowBottom}>
                    <Typography
                      variant={"body1"}
                      className={classes.bottomtextLeft}
                    >
                      No Shares
                    </Typography>
                    <Typography variant={"h6"} className={classes.bottomText}>
                      {noTokensGet
                        ? parseFloat(noTokensGet / 1000000).toFixed(2)
                        : 0}{" "}
                      No
                    </Typography>
                  </div>
                  <div className={classes.buttonDiv}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={classes.button}
                      fullWidth={true}
                    >
                      Remove Liquidity
                    </Button>
                  </div>
                </div>
              </form>
            )}
            {value === 2 &&
              (!market.resolved ? (
                <form onSubmit={resolveMarket}>
                  <div className={classes.tabContent}>
                    <Typography variant={"body1"} className={classes.text}>
                      Resolve(Yes/No)
                    </Typography>
                    <ToggleButtonGroup
                      color="secondary"
                      className={classes.outcomes}
                      value={outcome}
                      exclusive
                      onChange={handleChangeOutcome}
                      aria-label="text alignment"
                    >
                      <ToggleButton
                        value={0}
                        fullWidth
                        style={{
                          color: "white",
                          flex: 1,
                          backgroundColor: outcome === 0 && "#4BB84B",
                          border: "1px solid #4BB84B",
                        }}
                      >
                        Yes
                      </ToggleButton>
                      <div style={{ width: "8px" }}></div>
                      <ToggleButton
                        value={1}
                        fullWidth
                        style={{
                          flex: 1,
                          color: "white",
                          backgroundColor: outcome === 1 && "#B64444",
                          border: "1px solid #B64444",
                        }}
                      >
                        No
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <div style={{ marginTop: "200px" }}>
                      <div className={classes.buttonDiv}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className={classes.button}
                          fullWidth={true}
                        >
                          Resolve Market
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <Typography variant={"body1"} className={classes.text}>
                  Market Resolved already
                </Typography>
              ))}
          </Paper>
        </div>
        <h4 className={classes.questionText} style={{ bottom: "0px" }}>
          Description
        </h4>
        <h6 style={{ color: "white", fontSize: "13px" }}>
          {market.marketDescription}
        </h6>
      </div>
    );
  } else {
    return (
      <div className={classes.loadingBody}>
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
            {loadingText}
          </Typography>
        </div>
      </div>
    );
  }
}

export default MarketDetails;
