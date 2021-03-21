import React, { useEffect, useState } from "react"
import Avatar from "@material-ui/core/Avatar"
import { db } from "./firebase"
import firebase from "firebase/app"
import { Button, Input } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import "./Post.css"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"

const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
      "& > * + *": {
         marginTop: theme.spacing(2),
      },
   },
   paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
   },
}))

function Post({ postID, user, username, image_url, caption }) {
   const [comments, setComments] = useState([])
   const [comment, setComment] = useState("")
   const [count, setCount] = useState(null)

   useEffect(() => {
      let unsubscribe
      if (postID) {
         unsubscribe = db
            .collection("posts")
            .doc(postID)
            .collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
               setComments(snapshot.docs.map((doc) => doc.data()))
            })
      }

      return () => {
         unsubscribe()
      }
   }, [postID, user])
   // console.log("🚀 comments >>>", comments)
   useEffect(() => {
      db.collection("posts")
         .doc(postID)
         .collection("comments")
         .get()
         .then(function (querySnapshot) {
            setCount(querySnapshot.size)
         })
   }, [comments])

   function postComment(event) {
      event.preventDefault()

      db.collection("posts").doc(postID).collection("comments").add({
         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
         text: comment,
         username: user.displayName,
      })
      setComment("")
   }

   function post_delete() {
      db.collection("posts")
         .doc(postID)
         .delete()
         .then(() => {
            alert("post deleted sucessfully")
         })
         .catch((error) => {
            alert("Error removing document: ", error)
         })
   }
   return (
      <div className="post animate__animated animate__slideInDown">
         <div className={!user?"header-nouser":"header"}>
            <Avatar className="avatar">A</Avatar>
            <h5>{username}</h5>
            {user && (
               <Button
                  onClick={post_delete}
                  className="postHeader_button"
                  color="secondary"
               >
                  Delete
               </Button>
            )}
         </div>

         {/* avatar + username (header)*/}

         <div className="post_container">
            <img className="post_image" src={image_url} alt="" />
         </div>
         {/*image*/}

         <p className="post_caption">
            <strong className="postUsername">{username}</strong>
            {caption}
         </p>

         <h4 className="comment_text">View all {count} comments</h4>

         {/* username + caption */}

         <div className="comment_post">
            {comments.map((comment) => (
               <p>
                  <strong className="postUsername">{comment.username}</strong>
                  {comment.text}
               </p>
            ))}
         </div>
         {user && (
            <form className="comment_form">
               <input
                  className="comment_input"
                  type="text"
                  value={comment}
                  placeholder="enter a comment"
                  onChange={(e) => setComment(e.target.value)}
               />
               <button
                  disabled={!comment}
                  className="comment_button"
                  type="submit"
                  onClick={postComment}
               >
                  Post
               </button>
            </form>
         )}
      </div>
   )
}

export default Post
