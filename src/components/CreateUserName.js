import React from "react";
import { useRef, useState } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux"; // new
import Alert from "@material-ui/lab/Alert";
import { Link, useHistory } from "react-router-dom";
import { makeUsername } from "../actions"; // new
// import {useSelector} from 'react-redux';
import database from "../firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function CreateUserName() {
  const userNameRef = useRef();
  const confirmUserNameRef = useRef();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  // const userId = useSelector(state => state.userId)
  // const [test, setTest] = useState('')
  const auth = database.ref(`users`);

  /* New */
  const currentUsernames = [];
  database.ref(`users`).once("value", (snapshot) => {
    snapshot.forEach((dataSnapshot) => {
      let { handle } = dataSnapshot.val();

      currentUsernames.push({
        handle,
      });
    });
  });
  console.log(currentUsernames);

  function existingUserNameCheck(userNameToCheck) {
    if (currentUsernames.length > 0) {
      const usernameMatchTest = currentUsernames.find((user) => {
        console.log("user", user);
        debugger;
        return user.handle?.toUpperCase() === userNameToCheck.toUpperCase();
      });
      if (usernameMatchTest) {
        return true;
      } else {
        return false;
      }
    }
  }

  /* New */

  const classes = useStyles();

  async function handleSubmit(e) {
    e.preventDefault();

    if (userNameRef.current.value !== confirmUserNameRef.current.value) {
      return setError("Usernames do not match");
    }

    if (existingUserNameCheck(userNameRef.current.value)) {
      return setError("Username already taken");
    }

    try {
      setError("");
      setLoading(true);
      //   setTest(confirmUserNameRef.current.value)
      //   console.log(test)
      dispatch(makeUsername(userNameRef.current.value));
      history.push("/profile-pic-upload");
    } catch {
      setError("Failed to create a Username");
    }
    setLoading(false);
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Create a Username
          </Typography>

          {error && (
            <Alert variant="outlined" severity="error">
              {error}
            </Alert>
          )}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  inputRef={userNameRef}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirm_username"
                  label="Confirm Username"
                  type="confirm_username"
                  id="confirm_username"
                  autoComplete="confirm_username"
                  inputRef={confirmUserNameRef}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              Create Username
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
