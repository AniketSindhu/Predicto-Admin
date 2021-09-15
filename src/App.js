import "./App.css";
import useStyles from "./styles/homePageDesign";
import { AppBar, Toolbar, Link, Typography } from "@material-ui/core";
import ConnectButton from "./components/ConnectButton";
import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import DisconnectButton from "./components/DisconnectButton";

function App() {
  const classes = useStyles();
  const [Tezos, setTezos] = useState(
    new TezosToolkit("https://florencenet.smartpy.io")
  );
  const [wallet, setWallet] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [beaconConnection, setBeaconConnection] = useState(false);
  return (
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
        </Toolbar>
      </AppBar>
      <div className="App"></div>
    </div>
  );
}

export default App;
