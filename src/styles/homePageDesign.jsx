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
  appbarRight: {
    display: "flex",
    flexDirection: "row",
  },
  popularMarketText: {
    color: "white",
    textAlign: "left",
    margin: "30px 0px 10px 0px",
  },
  markets: {
    padding: "15px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "transparent",
    color: "white",
    elevation: 8,
    border: "2px solid #9282EC",
    height: "165px",
    justifyContent: "space-between",
  },
  marketRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
  },
  image: {
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    objectFit: "cover",
    margin: "0px 10px 0px 0px",
  },
  marketBottomRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marketBottomColumn: {
    display: "flex",
    flexDirection: "column",
  },
  price: {
    backgroundColor: "#483F5A",
    elevation: 20,
    textAlign: "center",
    color: "#F48FB1",
    padding: "8px",
    margin: "8px 0px 0px 0px",
  },
  loading: {
    display: "flex",
    height: "100vh",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default useStyles;
