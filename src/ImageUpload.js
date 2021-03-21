import { Button, TextField } from "@material-ui/core"
import React, { useState } from "react"
import { storage, db } from "./firebase"
import firebase from "firebase/app"
import "./ImageUpload.css"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import { makeStyles } from "@material-ui/core/styles"

function Alert(props) {
   return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
      "& > * + *": {
         marginTop: theme.spacing(2),
      },
   },
}))

function ImageUpload({ username }) {
   const [caption, setCaption] = useState("")
   const [progress, setProgress] = useState(0)
   const [image, setImage] = useState(null)
   const classes = useStyles()
   const [open, setOpen] = React.useState(false)
   function handleChange(e) {
      if (e.target.files[0]) {
         setImage(e.target.files[0])
      }
   }
   console.log("username ⭐️ ",username)
   const handleClose = (event, reason) => {
      if (reason === "clickaway") {
         return
      }

      setOpen(false)
   }

   function handleUpload() {
      const uploadTask = storage.ref(`images/${image.name}`).put(image)

      uploadTask.on(
         "state_changed",
         (snapshot) => {
            //progress function....
            const progress = Math.round(
               (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setProgress(progress)
         },
         (error) => {
            alert(error.message)
         },
         () => {
            //complete function...
            storage
               .ref("images")
               .child(image.name)
               .getDownloadURL()
               .then((url) => {
                  db.collection("posts").add({
                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                     caption: caption,
                     image_url: url,
                     username: username,
                  })

                  setProgress(0)
                  setCaption("")
                  setImage(null)
                  alert("image uploaded sucessfully")
               })
         }
      )
   }
   return (
      <div className="image_upload">
         <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
               <Alert onClose={handleClose} severity="success">
                  Upload Successfully Completed
               </Alert>
            </Snackbar>
         </div>
         <progress
            className="imageUpload_progress"
            value={progress}
            max="100"
         />
         <TextField
            id="outlined-basic"
            variant="outlined"
            className="imageUpload_inputField"
            type="text"
            placeholder="enter a caption...."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
         />
         <input
            className="imageUpload_file"
            type="file"
            onChange={handleChange}
         />
         <Button
            className="imageUpload_button"
            variant="contained"
            color="primary"
            onClick={handleUpload}
         >
            Upload
         </Button>
      </div>
   )
}

export default ImageUpload
