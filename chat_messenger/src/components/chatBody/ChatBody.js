import React, { useState, useEffect } from "react";
import "./chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";

var d = new Date();

const socket = io('http://localhost:5000')
const ChatBody = () => {
  const [user, setUser] = useState({})
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [startChat, setStartChat] = useState(false)
  const [newUser, setNewUser] = useState({})
  const [userLeft, setUserLeft] = useState({})
  let name = "admin"
  let room = user.email
  let userType = 'admin'
  useEffect(() => {
    if (room !== undefined) {
      socket.emit('join', { name, room, userType }, () => { })
    }
    // return () => {
    //     socket.disconnect()
    //     socket.off();
    // }
  }, [user])

  socket.on('users', (users) => {
    if (users.name !== 'admin') {
      setNewUser(users)
    }
  })
  socket.on('end', (message) => {
    let left = message.text.includes('has left')
    if (left) {
      if (left) {
        axios({
          url: "http://localhost:5000/api/updateStatus",
          method: "PUT",
          data: { email: message.email, status: 'Offline' },
        })
          .then((res) => {
            console.log('success', res)
          })

          .catch((err) => {
            console.log('failed', err)
          });
      }
      setUserLeft(message)
    }
  })
  //sending msg
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, name, room, d,() => setMessage(''));
      axios({
        url: "http://localhost:5000/api/update",
        method: "PUT",
        data: { name: name, email: room, date: d, type: '', message: message },
      })
        .then((res) => {
          console.log('success', res)
        })
        .catch((err) => {
          console.log('failed', err)
        });
    }
  }
  const handleCallback = (childData) => {
    setUser(childData)
    setStartChat(true)
  }
  return (
    <div className="main__chatbody">
      <ChatList handlecallback={handleCallback} newUser={newUser} userLeft={userLeft} />
      {startChat ? <ChatContent user={user} message={message} socket={socket} setMessage={setMessage} sendMessage={sendMessage} userLeft={userLeft} /> : <h1>Admin Messages</h1>}
    </div>
  );

}
export default ChatBody;
