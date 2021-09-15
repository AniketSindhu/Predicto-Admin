import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    height: 70,
    backgroundColor: "#27262C",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ConnectWallet: {
    color: "#F48FB1",
    borderColor: "#F48FB1",
    margin: "0px 8px 0px 8px",
  },
  DisconnectWallet: {
    color: "white",
    borderColor: "#F48FB1",
    margin: "0px 8px 0px 8px",
  },
  createMarket: {
    color: "#9282EC",
    borderColor: "#9282EC",
  },
  balanceText: {
    color: "#9282EC",
    fontSize: "12px",
    fontWeight: "normal",
    margin: "0px 8px 0px 0px",
  },
  addressText: {
    fontSize: "12px",
    fontWeight: "100",
    color: "#CC56CC",
    margin: "0px 0px 0px 5px",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  appbarRight:{
    display: "flex",
    flexDirection: "row",
  }
}));

export default useStyles;
