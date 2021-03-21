import "./App.css"
import Post from "./Post"
import { auth, db } from "./firebase"
import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import { Button } from "@material-ui/core"
import ImageUpload from "./ImageUpload"
import InstagramEmbed from "react-instagram-embed"
import VideoCard from "./VideoCard"

const useStyles = makeStyles((theme) => ({
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
   },
   paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      borderRadius: "5px",
      padding: theme.spacing(2, 4, 3),
   },
}))

function App() {
   const classes = useStyles()
   const [Posts, setPosts] = useState([])
   const [openSignUp, setOpenSignUp] = useState(false)
   const [openSignIn, setOpenSignIn] = useState(false)
   const [username, setUsername] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [user, setUser] = useState(null)
   const [userName, setUserName] = useState("")
   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
         if (authUser) {
            //loged in......
            console.log(authUser)
            setUser(authUser)
            setUserName(authUser.displayName)
         } else {
            //created new user........
            setUser(null)
         }
      })
      return () => {
         unsubscribe()
      }
   }, [user])
   console.log("👽", userName)

   useEffect(() => {
      db.collection("posts")
         .orderBy("timestamp", "desc")
         .onSnapshot((snapshot) => {
            setPosts(
               snapshot.docs.map((doc) => ({
                  id: doc.id,
                  post: doc.data(),
               }))
            )
         })
   }, [])

   const signUp = (event) => {
      event.preventDefault()

      auth
         .createUserWithEmailAndPassword(email, password)
         .then((authUser) => {
            return authUser.user.updateProfile({
               displayName: username,
            })
         })
         .catch((error) => alert(error.message))
      setOpenSignUp(false)
      setEmail("")
      setPassword("")
   }

   const signIn = (event) => {
      event.preventDefault()
      auth
         .signInWithEmailAndPassword(email, password)
         .catch((error) => alert(error.message))

      setOpenSignIn(false)
      setEmail("")
      setPassword("")
   }
   return (
      <div className="app">
         <div className="app__header">
            <div className="app__headerContainer container">
               <img
                  className="header_logo"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png"
                  alt=""
               />
               {user ? (
                  <Button onClick={() => auth.signOut()} variant="">
                     Logout
                  </Button>
               ) : (
                  <div className="app__headerRight">
                     <Button onClick={() => setOpenSignIn(true)} variant="">
                        Sign In
                     </Button>
                     <Button onClick={() => setOpenSignUp(true)} variant="">
                        Sign Up
                     </Button>
                  </div>
               )}
            </div>
         </div>

         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={openSignIn}>
               <div className={classes.paper}>
                  <div className="app__modal">
                     <center>
                        <img
                           className="app__insta"
                           src="https://download.logo.wine/logo/Instagram/Instagram-Wordmark-Logo.wine.png"
                           alt=""
                        />
                     </center>

                     <form className="app__form">
                        <input
                           placeholder="email"
                           type="email"
                           value={email}
                           onChange={(event) => setEmail(event.target.value)}
                        />

                        <input
                           placeholder="password"
                           type="pass"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                        />
                        <center>
                           <Button
                              type="submit"
                              onClick={signIn}
                              color="primary"
                           >
                              Sign In
                           </Button>
                        </center>
                     </form>
                  </div>
               </div>
            </Fade>
         </Modal>
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openSignUp}
            onClose={() => setOpenSignUp(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={openSignUp}>
               <div className={classes.paper}>
                  <div className="app__modal">
                     <center>
                        <img
                           className="app__insta"
                           src="https://download.logo.wine/logo/Instagram/Instagram-Wordmark-Black-Logo.wine.png"
                           alt=""
                        />
                     </center>
                     <form className="app__form">
                        <input
                           placeholder="username"
                           type="text"
                           value={username}
                           onChange={(event) => setUsername(event.target.value)}
                        />
                        <input
                           placeholder="email"
                           type="email"
                           value={email}
                           onChange={(event) => setEmail(event.target.value)}
                        />

                        <input
                           placeholder="password"
                           type="pass"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                        />
                        <center>
                           <Button
                              type="submit"
                              onClick={signUp}
                              color="secondary"
                           >
                              sign up
                           </Button>
                        </center>
                     </form>
                  </div>
               </div>
            </Fade>
         </Modal>
         <div className="app_posts container">
            <div className="app__container justify-content-center d-flex">
               <div className="appPost_left mr-md-5 ">
                  {Posts.map(({ id, post }) => (
                     <Post
                        key={id}
                        postID={id}
                        user={user}
                        username={post.username}
                        image_url={post.image_url}
                        caption={post.caption}
                     />
                  ))}
               </div>
               <div className="appPost_right ">
                  <div className="app__embed animate__delay-1s	 animate__animated animate__fadeInRight">
                     <InstagramEmbed
                        url="https://www.instagram.com/p/CL7bHuwFpfI/"
                        clientAccessToken="3587860781312472|9aa2822eb0f1649a09d4c856ff34979a"
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName="div"
                        protocol=""
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {
                           console.log("embeded loaded sucessfully")
                        }}
                     />
                  </div>

                  <div className="app__videos animate__delay-2s animate__animated animate__zoomIn">
                     <VideoCard video="thor.mp4" like="566" comment="10K"/>
                     <VideoCard video="spiderman.mp4" like="856" comment="5K"/>
                     <VideoCard video="ironman.mp4" like="978" comment="2K"/>
                  </div>
               </div>
            </div>
         </div>

         {user ? (
            <center>
               <ImageUpload username={userName == null ? username : userName} />
            </center>
         ) : (
            <center>
               <div className="noUser_comment">
                  <h5>You need to log in buddy🔥</h5>
               </div>
            </center>
         )}
      </div>

      /*post*/
   )
}

export default App
