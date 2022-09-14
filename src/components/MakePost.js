import React, { useState } from "react";
import { Card, Button, CardContent, Grid } from "@material-ui/core";
import {
  post,
  makePostAction,
  makeUploadImageAction,
  postButtonClicked,
  loadingAction,
  loadingStartAction,
  photoButtonClicked,
  loadingEndAction,
  profileClicked,
} from "../actions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { AiOutlinePicture } from "react-icons/ai";
import { MdAdd } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  inputForm: {
    padding: "8px 8px 8px 8px",
    borderRadius: "6px",
    backgroundColor: "#F3F3F3",
    border: "none",
    width: "98%",
  },
  inputFormPhoto: {
    padding: "8px 8px 8px 8px",
    marginTop: "5px",
    borderRadius: "6px",
    backgroundColor: "#F3F3F3",
    border: "none",
    width: "100%",
  },
  picButton: {
    textTransform: "none",
    backgroundColor: "#2a85ff",
    color: "white",
    borderRadius: "8px",
    fontSize: "12px",
    padding: "8px 35px 8px 35px",
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

export default function MakePost() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const usernameHandle = useSelector((state) => state.username);
  const profilePic = useSelector((state) => state.profilePic);
  const photoClickedState = useSelector((state) => state.photoButtonClicked);
  const [fileInputState, setFileInputState] = useState(""); /* new */
  const [previewSource, setPreviewSource] = useState(""); /* new */
  const [textInput, setTextInput] = useState(""); /* new */
  const [errorMessage, setErrorMessage] = useState("");
  const classes = useStyles();

  // console.log("previewSource", previewSource);

  const onInputChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!title) return;
    dispatch(
      makePostAction({
        title,
        comment: false,
        comments_text: "",
        handle: usernameHandle,
        profilePic: profilePic,
        post_date: new Date().getTime(),
      })
    );
    setTitle("");
    dispatch(postButtonClicked());
  };

  /* new */
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("here ++++++++++++++++++++++");
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

  const handleInputChange = (e) => {
    const { value } = e.target;
    setTextInput(value);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    /* added */
    if (file) {
      /* added */
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
      /* added */
    }
    /* added */
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
    setPreviewSource("");
    setTextInput("");
    dispatch(postButtonClicked());
  };

  const uploadImage = async (base64EncodedImage) => {
    console.log(base64EncodedImage);
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

      dispatch(
        makeUploadImageAction({
          imageURL,
          comment: false,
          comments_text: "",
          handle: usernameHandle,
          post_date: new Date().getTime(),
          title: textInput,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(loadingEndAction());
    }
  };
  /* new */

  return (
    <div>
      <Card style={{ margin: "20px 0px 20px 0px" }}>
        <CardContent>
          <Grid container>
            <Grid
              item
              xs={1}
              style={{
                paddingTop: ".5%",
                marginBottom: "10px",
                padding: "0 0 0 0",
              }}
            >
              {profilePic ? (
                <div>
                  <img
                    src={profilePic}
                    width="40px"
                    height="40px"
                    alt="profile pic"
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div>
                  <img
                    src="images/profile_pic_default.jpg" /* DON'T DELETE THIS MESSAGE: keep images in public folder */
                    width="40px"
                    height="40px"
                    alt="profile pic default"
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              )}
            </Grid>
            <Grid
              item
              xs={11}
              style={{
                paddingTop: "1.3%",
                textAlign: "right",
              }}
            >
              <form onSubmit={handleSubmit}>
                <input
                  className={classes.inputForm}
                  type="text"
                  value={title}
                  onChange={onInputChange}
                  placeholder="What would you like to share?"
                />
              </form>
            </Grid>
          </Grid>

          <form onSubmit={handleSubmitFile} className="form">
            <label htmlFor="myInput" className={classes.picButton}>
              <MdAdd
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginRight: "2px",
                  verticalAlign: "bottom",
                }}
              />
              Photo
            </label>
            <input
              id="myInput"
              style={{ display: "none" }}
              type={"file"}
              onChange={(e) => handleFileInputChange(e)}
            />
            {errorMessage && <p style={{ color: "#ff0000" }}>{errorMessage}</p>}
            <Grid container>
              <Grid item xs={1} />
              <Grid
                item
                xs={10}
                // style={{ textAlign: "center" }}
              >
                {previewSource && (
                  <>
                    <img
                      src={previewSource}
                      alt="chosen"
                      style={{
                        height: "250px",

                        marginTop: "10px",
                      }}
                    />

                    <input
                      type="text"
                      name="inputText"
                      onChange={handleInputChange}
                      value={textInput}
                      placeholder="Caption your picture"
                      className={classes.inputFormPhoto}
                    />
                    <Button className={classes.submitButton} type="submit">
                      Submit
                    </Button>
                    <Button
                      className={classes.cancelButton}
                      onClick={() => setPreviewSource("")}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Grid>
              <Grid item xs={1} />
            </Grid>
            <br />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
