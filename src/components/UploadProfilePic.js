import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, CardContent, Container } from "@material-ui/core";
import {
  loadingAction,
  loadingEndAction,
  loadingStartAction,
  makeProfilePictureUpload,
  updateProfilePic,
} from "../actions";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import FullPageLoader from "./FullPageLoader";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { MdAdd } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  cardStyle: {
    marginTop: "2em",
    width: "350px",
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
  skipButton: {
    marginTop: "30px",

    width: "135px",
    padding: "8px 0px 8px 0px",
    fontWeight: "bold",
    fontSize: "12px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#343434",
  },
}));

export default function UploadProfilePic() {
  const [fileInputState, setFileInputState] = useState(""); /* new */
  const [previewSource, setPreviewSource] = useState(""); /* new */
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector((state) => state.loading);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();

    if (!previewSource) {
      history.push("/");
    } else {
      uploadImage(previewSource);
      setPreviewSource("");
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
      }

      dispatch(makeProfilePictureUpload(imageURL));
      history.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(loadingEndAction());
    }
  };

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Select a Profile Picture
        </Typography>
        <div className={classes.cardStyle}>
          <Card>
            <CardContent>
              {loading.isLoading ? <FullPageLoader /> : null}
              {/* new */}

              <form onSubmit={handleSubmitFile} className="form">
                <label
                  htmlFor="myinputFirstProfilePicture"
                  className={classes.profilePicButton}
                >
                  <MdAdd
                    style={{
                      color: "white",
                      verticalAlign: "bottom",
                      fontSize: "18px",
                      marginRight: "2px",
                      marginTop: "6px",
                    }}
                  />
                  Photo
                </label>

                <input
                  id="myinputFirstProfilePicture"
                  type={"file"}
                  name="image"
                  onChange={handleFileInputChange}
                  value={fileInputState}
                  className="form-input"
                  style={{ display: "none" }}
                />

                <div>
                  {previewSource ? (
                    <>
                      <div>
                        <img
                          src={previewSource}
                          alt="chosen"
                          style={{
                            width: "200px",
                            height: "200px",
                            marginTop: "20px",
                            objectFit: "cover",

                            borderRadius: "10px",
                            display: "block",
                            margin: "auto",
                          }}
                        />
                      </div>
                      <Button
                        className="btn"
                        type="submit"
                        style={{ marginTop: "10px" }}
                        className={classes.submitButton}
                      >
                        Submit
                      </Button>
                      <Button
                        onClick={() => setPreviewSource("")}
                        style={{ marginLeft: "2px" }}
                        className={classes.cancelButton}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <div>
                      <img
                        src="images/profile_pic_default.jpg"
                        width="200px"
                        alt="profile pic default"
                        style={{
                          borderRadius: "10px",
                          display: "block",
                          margin: "auto",
                          marginTop: "20px",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => {
                      setPreviewSource("");
                    }}
                    className={classes.skipButton}
                  >
                    Skip
                  </button>
                </div>
              </form>

              {/* new */}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
