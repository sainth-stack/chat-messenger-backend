import React, { Component, useState, useRef, useEffect } from "react";
import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import axios from 'axios'
const ChatContent = (props) => {
  console.log(props)
  const messagesEndRef = useRef(null)
  const [message1, setMessage1] = useState('')
  const img = "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
  // const chatItms = [
  //   {
  //     key: 1,
  //     image:
  //       "https://huber.ghostpool.com/wp-content/uploads/avatars/3/596dfc2058143-bpfull.png",
  //     type: "",
  //     msg: "Hi Tim, How are you?",
  //   },
  //   {
  //     key: 2,
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
  //     type: "other",
  //     msg: "I am fine.",
  //   },
  //   {
  //     key: 3,
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
  //     type: "other",
  //     msg: "What about you?",
  //   },
  //   {
  //     key: 4,
  //     image:
  //       "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
  //     type: "",
  //     msg: "Awesome these days.",
  //   },
  //   {
  //     key: 5,
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
  //     type: "other",
  //     msg: "Finally. What's the plan?",
  //   },
  //   {
  //     key: 6,
  //     image:
  //       "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
  //     type: "",
  //     msg: "what plan mate?",
  //   },
  //   {
  //     key: 7,
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
  //     type: "other",
  //     msg: "I'm taliking about the tutorial",
  //   },
  // ];
  const [data, setData] = useState([])
  const [myMessage, setMyMessage] = useState(false)
  const [isOnline2, setIsOnline] = useState("")
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    props.socket.on('message', (message) => {
      console.log(message)
      const updateData = [...data, { message: message.text, type: myMessage ? '' : 'other', msgid: 'hello',date:message.date }]
      setData(updateData)
      setMyMessage(false)
      scrollToBottom()

    })
  }, [data, myMessage])

  useEffect(() => {
    setIsOnline("")
    axios({
      url: "http://localhost:5000/api/getuserbyid/" + `${props.user.email}`,
      method: "GET",
    })
      .then((res) => {
        console.log('success', res.data.data[0].message)
        let updateData = [...res.data.data[0].message]
        setData(updateData)
        scrollToBottom()
      })
      .catch((err) => {
        console.log('failed', err)
      });
  }, [props.user])

  useEffect(() => {
    if (!(Object.keys(props.userLeft).length === 0)) {
      console.log("userLeft")
      setIsOnline("Offline")
    }
  }, [props.userLeft])

  const sendMessage = (e) => {
    // const updateData = { message: message1, type: '', msgid: `${props.user.room}`
    setMyMessage(true)
    props.sendMessage(e)
    scrollToBottom()
  }
  useEffect(scrollToBottom);

  const onChangeMessage = (e) => {
    props.setMessage(e.target.value)
    setMessage1(e.target.value)
  }
  const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU";
  return (
    <div className="main__chatcontent">
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <Avatar
              isOnline={isOnline2 ? isOnline2 : props.user.isOnline}
              image={image}
            />
            <p>{props.user.name}</p>
          </div>
        </div>

        <div className="blocks">
          <div className="settings">
            <button className="btn-nobg">
              <i className="fa fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="content__body">
        <div className="chat__items">
          {data.map((itm, index) => {
            return (
              <ChatItem
                animationDelay={index + 2}
                key={index}
                user={itm.type ? itm.type : "me"}
                msg={itm.message}
                image={itm.type ? image : image}
                isOnline={isOnline2 ? isOnline2 : props.user.isOnline}
                name={props.user.name}
                email={props.user.email}
                date={itm.date}
              />
            );
          })}
          <div ref={
            messagesEndRef} />
        </div>
      </div>
      <div className="content__footer">
        <div className="sendNewMessage">
          <button className="addFiles">
            <i className="fa fa-plus"></i>
          </button>
          <input
            type="text"
            placeholder="Type a message here"
            onChange={(e) => onChangeMessage(e)}
            value={props.message}
            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
          />
          <button className="btnSendMsg" id="sendMsgBtn" onClick={(e) => sendMessage(e)}>
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatContent

// export default class ChatContent extends Component {
//   messagesEndRef = createRef(null);
//   chatItms = [
//     {
//       key: 1,
//       image:
//         "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
//       type: "",
//       msg: "Hi Tim, How are you?",
//     },
//     {
//       key: 2,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
//       type: "other",
//       msg: "I am fine.",
//     },
//     {
//       key: 3,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
//       type: "other",
//       msg: "What about you?",
//     },
//     {
//       key: 4,
//       image:
//         "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
//       type: "",
//       msg: "Awesome these days.",
//     },
//     {
//       key: 5,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
//       type: "other",
//       msg: "Finally. What's the plan?",
//     },
//     {
//       key: 6,
//       image:
//         "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
//       type: "",
//       msg: "what plan mate?",
//     },
//     {
//       key: 7,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
//       type: "other",
//       msg: "I'm taliking about the tutorial",
//     },
//   ];

//   constructor(props) {
//     super(props);
//     this.state = {
//       chat: this.chatItms,
//       msg: "",
//     };
//   }

//   scrollToBottom = () => {
//     this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   componentDidMount() {
//     window.addEventListener("keydown", (e) => {
//       if (e.keyCode == 13) {
//         if (this.state.msg != "") {
//           this.chatItms.push({
//             key: 1,
//             type: "",
//             msg: this.state.msg,
//             image:
//               "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
//           });
//           this.setState({ chat: [...this.chatItms] });
//           this.scrollToBottom();
//           this.setState({ msg: "" });
//         }
//       }
//     });
//     this.scrollToBottom();
//   }
//   onStateChange = (e) => {
//     this.setState({ msg: e.target.value });
//   };

//   render() {
//     return (
//       <div className="main__chatcontent">
//         <div className="content__header">
//           <div className="blocks">
//             <div className="current-chatting-user">
//               <Avatar
//                 isOnline="active"
//                 image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
//               />
//               <p>Tim Hover</p>
//             </div>
//           </div>

//           <div className="blocks">
//             <div className="settings">
//               <button className="btn-nobg">
//                 <i className="fa fa-cog"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="content__body">
//           <div className="chat__items">
//             {this.state.chat.map((itm, index) => {
//               return (
//                 <ChatItem
//                   animationDelay={index + 2}
//                   key={itm.key}
//                   user={itm.type ? itm.type : "me"}
//                   msg={itm.msg}
//                   image={itm.image}
//                 />
//               );
//             })}
//             <div ref={this.messagesEndRef} />
//           </div>
//         </div>
//         <div className="content__footer">
//           <div className="sendNewMessage">
//             <button className="addFiles">
//               <i className="fa fa-plus"></i>
//             </button>
//             <input
//               type="text"
//               placeholder="Type a message here"
//               onChange={this.onStateChange}
//               value={this.state.msg}
//             />
//             <button className="btnSendMsg" id="sendMsgBtn">
//               <i className="fa fa-paper-plane"></i>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
