import "./App.css";
import useStyles from "./styles/homePageDesign";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import ConnectButton from "./components/ConnectButton";
import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import DisconnectButton from "./components/DisconnectButton";
import { Switch, Route, Link } from "react-router-dom";
import CreateMarket from "./components/CreateMarket";
import { useHistory } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";

function App() {
  const classes = useStyles();
  const [Tezos, setTezos] = useState(
    new TezosToolkit("https://florencenet.smartpy.io")
  );
  const [wallet, setWallet] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [beaconConnection, setBeaconConnection] = useState(false);

  const appliedTheme = createTheme({
    palette: {
      type: "dark",
      mode: "dark",
    },
  });

  let history = useHistory();
  return (
    <ThemeProvider theme={appliedTheme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Link
              to={"/"}
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <Typography variant="h5" style={{ cursor: "pointer" }}>
                <b>Predicto Admin</b>
              </Typography>
            </Link>
            <div className={classes.appbarRight}>
              <Button
                variant="outlined"
                className={classes.createMarket}
                onClick={() => {
                  history.push("/createMarket");
                }}
              >
                Create Market
              </Button>
              {userAddress === "" && !beaconConnection ? (
                <ConnectButton
                  Tezos={Tezos}
                  setWallet={setWallet}
                  setUserAddress={setUserAddress}
                  setUserBalance={setUserBalance}
                  setBeaconConnection={setBeaconConnection}
                  wallet={wallet}
                />
              ) : (
                <DisconnectButton
                  wallet={wallet}
                  setUserAddress={setUserAddress}
                  setUserBalance={setUserBalance}
                  setWallet={setWallet}
                  setTezos={setTezos}
                  setBeaconConnection={setBeaconConnection}
                  userBalance={userBalance}
                  userAddress={userAddress}
                />
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/">
            <div className="App"></div>
          </Route>
          <Route exact path="/createMarket">
            <div className="App">
              <CreateMarket
                balance={userBalance}
                address={userAddress}
                Tezos={Tezos}
              />
            </div>
          </Route>
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
