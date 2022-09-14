import React, { useRef, useState } from "react";
import {
  Card,
  Button,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@material-ui/core";
import FullPageLoader from "./FullPageLoader";
import { confirmAlert } from "react-confirm-alert";
import {
  makeDeleteProfile,
  updateProfilePic,
  loadingStartAction,
  loadingEndAction,
  makeProfilePictureUpload,
  profileClicked,
} from "../actions";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import UploadProfilePic from "./UploadProfilePic";
// import AddIcon from "@mui/icons-material/Add";
import { MdAdd, MdDelete, MdOutlineLogout } from "react-icons/md";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import useOnClickOutside from "../hooks/useOutsideClick";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "350px",
    position: "absolute",
    right: "1.5em",
  },
  inputField: {
    backgroundColor: "#f4f4f4",
    padding: "8px",
    borderRadius: "8px",
    fontWeight: 500,
  },
  profilePicButton: {
    textTransform: "none",
    backgroundColor: "#2a85ff",
    color: "white",
    borderRadius: "8px",
    fontSize: "12px",
    padding: 9,
    paddingLeft: 17,
    paddingRight: 17,
  },
  deleteButton: {
    textTransform: "none",
    backgroundColor: "#343434",
    color: "white",
    fontSize: "12px",
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  logOutButton: {
    textTransform: "none",
    outlineStyle: "solid",
    color: "black",
    fontSize: "12px",
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderColor: "#787878",
  },
  profileSectionHeader: {
    fontWeight: 500,
  },
  submitButton: {
    textTransform: "none",
    color: "white",
    backgroundColor: "#2a85ff",
    fontSize: "12px",
    margin: "10px 5px 0px 0px",
  },
  cancelButton: {
    textTransform: "none",
    color: "white",
    backgroundColor: "#FF6A55",
    fontSize: "12px",
    marginTop: "10px",
  },
}));

export default function Profile() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { currentUser, logout, deleteUserProfile } = useAuth();
  const profilePic = useSelector((state) => state.profilePic);
  const username = useSelector((state) => state.username);
  const loading = useSelector((state) => state.loading);
  const profilePicUpdate = useSelector((state) => state.profilePicUpdate);
  const history = useHistory();
  const classes = useStyles();
  const [click, setClick] = useState(false);
  const [profilePreviewSource, setProfilePreviewSource] =
    useState(""); /* new */
  const [errorMessage, setErrorMessage] = useState("");

  const ref = useRef();

  /* new */
  const handleFileInputChangeProfile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileSize = file.size;
      console.log("filezie", fileSize, file.name);
      if (!file.name.match(/\.(jpg|jpeg|png)$/g)) {
        setErrorMessage(
          "Please upload only files with jpg, jpeg and png extension."
        );
        return;
      }
      if (fileSize > 1000000) {
        setErrorMessage("Maximum file upload size is 1MB.");
        return;
      }
      setErrorMessage("");

      previewFile(file);
    }
  };

  const closePopup = () => {
    dispatch(profileClicked());
  };

  //useOnClickOutside(ref, closePopup);

  const previewFile = (file) => {
    const reader = new FileReader();
    console.log("selected ++++");
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfilePreviewSource(reader.result);
      };
    }
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();

    if (!profilePreviewSource) {
      history.push("/");
    } else {
      uploadImage(profilePreviewSource);
      setProfilePreviewSource("");
    }
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      /* const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: JSON.stringify({data: base64EncodedImage}),
        headers: {'Content-type': 'application/json'}
      });
      const result = await response.json();
      console.log({result}); */
      dispatch(loadingStartAction());
      const URLresult = await axios.post(
        "https://social-app-server99.herokuapp.com/api/upload",
        {
          data: {
            base64EncodedImage,
          },
        }
      );

      let imageURL;
      for (const [key, value] of Object.entries(URLresult.data)) {
        imageURL = value;
        console.log("TIVEWRWE", imageURL);
      }

      dispatch(makeProfilePictureUpload(imageURL));
      console.log("Tiger", imageURL);
      history.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(loadingEndAction());
    }
  };
  /* new */

  const submitProfileDelete = () => {
    confirmAlert({
      message: "Are you sure you want to delete your profile?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            dispatch(makeDeleteProfile());
            handleLogout();
            await deleteUserProfile();
          },
          // onClick: () => dispatch(makeDeleteProfile(), handleLogout),
        },
        {
          label: "No",
        },
      ],
    });
  };

  async function handleLogout() {
    setError("");

    try {
      await logout();

      dispatch({
        type: "RESET_STATE",
      });
      history.pushState("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="profile">
      <Card className={classes.paper}>
        <CardContent>
          <strong style={{ fontSize: 18 }}>Profile Information</strong>

          <Grid container style={{ marginTop: "15px" }}>
            <Grid item xs={3} style={{ fontSize: 0 }}>
              {profilePic ? (
                <img
                  src={profilePic}
                  width="50px"
                  height="50px"
                  alt="profile pic"
                  style={{ borderRadius: "10px", objectFit: "cover" }}
                />
              ) : (
                <img
                  src="images/profile_pic_default.jpg"
                  width="50px"
                  height="50px"
                  alt="profile pic default"
                  style={{ borderRadius: "10px" }}
                />
              )}
            </Grid>
            <Grid item xs={9} style={{ margin: "auto" }}>
              <form onSubmit={handleSubmitFile}>
                <label
                  htmlFor="myinputProfile"
                  className={classes.profilePicButton}
                >
                  <MdAdd
                    style={{
                      color: "white",
                      verticalAlign: "bottom",
                      fontSize: "18px",
                      marginRight: "2px",
                    }}
                  />
                  Update Profile Pic
                </label>
                <input
                  id="myinputProfile"
                  style={{ display: "none" }}
                  type={"file"}
                  onChange={(e) => handleFileInputChangeProfile(e)}
                />
                {errorMessage && (
                  <p style={{ color: "#ff0000" }}>{errorMessage}</p>
                )}
                <div>
                  <Grid container>
                    <Grid item xs={1} />
                    <Grid item xs={10}>
                      {profilePreviewSource && (
                        <>
                          <img
                            src={profilePreviewSource}
                            alt="chosen"
                            style={{ height: "10em", marginTop: "10px" }}
                          />
                          <div>
                            <Button
                              className={classes.submitButton}
                              type="submit"
                            >
                              Submit
                            </Button>
                            <Button
                              className={classes.cancelButton}
                              onClick={() => {
                                setProfilePreviewSource("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </div>
              </form>
            </Grid>
          </Grid>

          {error && (
            <Alert variant="outlined" severity="error">
              {error}
            </Alert>
          )}
          <br />
          <div className={classes.profileSectionHeader}>Display name: </div>

          <div className={classes.inputField} style={{ marginTop: "10px" }}>
            {username}
          </div>
          <br />
          <div className={classes.profileSectionHeader}>Email: </div>

          <div className={classes.inputField} style={{ marginTop: "10px" }}>
            {currentUser.email}
          </div>
          <br />
          <Grid container justify="flex-end">
            <Grid item xs={8} style={{ textAlign: "right" }}>
              <Button
                href="/#"
                onClick={() => submitProfileDelete()}
                variant="body2"
                className={classes.deleteButton}
              >
                <MdDelete
                  style={{
                    color: "white",
                    marginRight: "5px",
                    fontSize: "20px",
                  }}
                />
                Delete Profile
              </Button>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <Button
                href="/#"
                onClick={handleLogout}
                variant="body2"
                className={classes.logOutButton}
                variant="outlined"
              >
                <LogoutIcon
                  style={{
                    marginRight: "5px",
                    fontSize: "17px",
                  }}
                />
                Log Out
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
