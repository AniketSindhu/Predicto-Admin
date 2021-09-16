import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "30px 0px 0px 0px",
    height: "500px",
    width: "60%",
    border: "1px solid #9282EC",
    backgroundColor: "transparent",
    padding: "0px 20px 0px 20px",
  },
  CreateMarket: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  outline: {
    borderColor: "#9282EC",
    "&:hover fieldset": {
      borderColor: "#9282EC",
    },
  },
  placeholder: {
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  closingDate: {
    border: "1px solid #9282EC",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent:"center",
    color:"white",
    cursor:"pointer",
    '&:hover':{
    border: "1px solid #3F51B5",
    }
  },
}));

export default useStyles;
