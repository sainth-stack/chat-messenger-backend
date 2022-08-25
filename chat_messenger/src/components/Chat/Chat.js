import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
import './Chat.css'
import axios from 'axios'
const socket = io('http://localhost:5000')
var d = new Date();
const Chat = (props) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const name = props.data.name
    const room = props.data.email
    const msg = props.data.message
    const type = props.data.type
    useEffect(() => {
        if (props.visible) {
            socket.emit('join', { name, room, msg, type }, () => { })
            return () => {
                socket.emit('disconnect')
            }
        }
    }, [name])
    useEffect(() => {
        if (props.visible) {
            socket.on('message', (message) => {
                setMessages([...messages, message])
            })
        }
    }, [messages, props.visible])

    //sending msg
    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, name, room, d,() => setMessage(''));
            axios({
                url: "http://localhost:5000/api/update",
                method: "PUT",
                data: { name: name, email: room, socketid: room, type: 'other',date:d, message: message },
            })

                .then((res) => {
                    console.log('success', res)
                })

                .catch((err) => {
                    console.log('failed', err)
                });
        }
    }
    return (
        <div>
            {props.visible &&
                <div className="container1" style={{ borderRadius: '20px' }}>
                    <InfoBar room={room} />
                    <Messages messages={messages} name={name} room={room} />
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                </div>
            }
        </div>
    )
}
export default Chat;