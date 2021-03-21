import { Avatar } from "@material-ui/core"
import React from "react"
import "./VideoFooter.css"
import Ticker from "react-ticker"
import MusicNoteIcon from "@material-ui/icons/MusicNote"
import FavoriteIcon from "@material-ui/icons/Favorite"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import SendIcon from "@material-ui/icons/Send"
function VideoFooter({ like, comment }) {
   return (
      <div className="videoFooter">
         <div className="p-2 text-white d-flex flex-column">
            <div className="d-flex align-items-center ">
               <Avatar src="https://www.macobserver.com/wp-content/uploads/2019/09/workfeatured-iOS-13-memoji.png" />

               <div className="d-flex ml-3 align-items-center">
                  <p>Channel__name·</p>
                  <button className=" font-weight-bold bg-transparent border-0 text-white">
                     <p>Follow</p>
                  </button>
               </div>
            </div>

            <div className="d-flex my-1 align-items-center">
               <MusicNoteIcon fontSize="" />
               <div className="w-100">
                  <Ticker>
                     {({ index }) => (
                        <>
                           <p>song-----sample</p>
                        </>
                     )}
                  </Ticker>
               </div>
            </div>
            <div className="d-flex justify-content-between">
               <div className="d-flex align-items-center">
                  <FavoriteIcon />
                  <ChatBubbleIcon />
                  <SendIcon />
               </div>
               <div className="d-flex align-items-center">
                  <FavoriteIcon fontSize="small" />
                  <p className="my-3">{like}</p>
                  <ChatBubbleIcon className="comment" fontSize="small" />
                  <p className="my-3">{comment}</p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default VideoFooter
