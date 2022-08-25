import React from 'react';
import axios from 'axios';
import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name ,room}) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  let msgcontains = text.includes('has joined!') || text.includes('has left')
  let left = text.includes('has left')
  if (left && user !=='admin') {
    axios({
      url: "http://localhost:5000/api/updateStatus",
      method: "PUT",
      data: { email: room, status: 'Offline'},
    })
      .then((res) => {
        console.log('success', res)
      })

      .catch((err) => {
        console.log('failed', err)
      });
  }
  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd mt-2">
          {/* <p className="sentText pr-10">{trimmedName}</p> */}
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
      )
      : (
        <div className={msgcontains ? "centerlines mt-2 mb-2" : "messageContainer justifyStart mt-2 mb-2"}>
          <div className={msgcontains ? "messageBox4 " : "messageBox backgroundLight"}>
            <p className={msgcontains ? "messageText2" : "messageText colorDark"}>{text}</p>
          </div>
          {/* <p className="sentText pl-10 ">{user}</p> */}
        </div>
      )
  );
}

export default Message;