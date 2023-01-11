import React from "react";

function EmptyChatRoom() {
  return (
    <div>
      <div className="EmptyChatroom">
        <img className="emptychatroom-img"
          src="/images/profile/blankmessage.png"
          alt=""
        ></img>
        <p className="empty-chatroom-mainhead">Start Chatting with Your Amigo🤝</p>
        <p className="empty-chatroom-subhead">
          Select an Amigo from the Sidebar and Start conversation. <br/>
          Add Amigos by username from the option in the top right corner of the page
        </p>
      </div>
    </div>
  );
}

export default EmptyChatRoom;
