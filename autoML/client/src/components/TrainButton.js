import React, { useState } from "react";
import clsx from "clsx";
import rpcService from "../services/rpcService";
import AndroidIcon from "@material-ui/icons/Android";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import "../styles/app.css";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
  },
  buttonProgress: {
    color: green[500],
  },
}));

const TrainButton = ({
  fileOne,
  fileTwo,
  filenameOne,
  filenameTwo,
  setClassNames,
}) => {
  const classes = useStyles();
  const [modelTraining, setModelTraining] = useState(false);
  const [modelSuccess, setModelSuccess] = useState(false);

  const trainModel = (event, filenameOne, filenameTwo, setClassNames) => {
    // Makes a POST request to Go Server
    // Go Server makes a RPC Call to Python server.
    // Python Server downloads files from GO server and trains models with those files
    // Then serves the model with TF serving
    if (!fileOne || !fileTwo) {
      window.alert(
        "Error: Please upload zip files for both classes before training."
      );
      return;
    }
    event.preventDefault();
    setModelTraining(true);
    setModelSuccess(false);

    rpcService.trainModel(filenameOne, filenameTwo).then((response) => {
      console.log(response);
      setClassNames(response.class_names);
      setModelTraining(false);
      setModelSuccess(true);
    });
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: modelSuccess,
  });

  return (
    <div id="train-button-wrapper">
      <div className={classes.wrapper}>
        <Fab
          variant="extended"
          color="inherit"
          className={buttonClassname}
          onClick={(e) =>
            trainModel(e, filenameOne, filenameTwo, setClassNames)
          }
          disabled={modelTraining}
        >
          {modelSuccess ? (
            <CheckIcon style={{ margin: "0.25em" }} />
          ) : (
            <AndroidIcon style={{ margin: "0.25em" }} />
          )}
          Train Model
        </Fab>
      </div>
      {modelTraining && (
        <div>
          <CircularProgress
            style={{ margin: "2em" }}
            size={48}
            className={classes.fabProgress}
          />
          <p>Training Model...</p>
        </div>
      )}
      {modelSuccess && (
        <div id="model-status">
          <strong>Model Training Complete!</strong>
        </div>
      )}
    </div>
  );
};

export default TrainButton;
