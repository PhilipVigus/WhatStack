import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import languageArray from './languages'
import MessageInput from './MessageInput'

let socket

const Chat = ({ username, room }) => {
  const [name] = useState(username)
  const [, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const ENDPOINT = process.env.REACT_APP_BACKEND

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('join', { name, room })
  }, [ENDPOINT, name, room])

  const handleSubmitMessage = (message) => {
    socket.emit('message', { name, message, room })
    setMessage('')
  }

  useEffect(() => {
    socket.on('message', ({ name, message }) => {
      setMessages([...messages, { name, message }])
    })
    socket.on('messages', (messageArray) => {
      setMessages(messageArray)
    })
  })

  function isCode(msg) {
    const startCode = msg.slice(0, 3) === '```'
    const endCode = msg.slice(msg.length - 3) === '```'
    return startCode && endCode
  }

  function formatMessage(msg) {
    if (isCode(msg)) {
      let language = ''
      let code = msg.slice(3, msg.length - 3)

      if (msg.match(/^(```([\w-]+))[\s\S]*(```)$/)) {
        language = msg.match(/^(```([\w-]+))[\s\S]*(```)$/)[2]
      }

      const isValidLanguage = languageArray.includes(language)

      if (isValidLanguage) {
        code = code.slice(language.length)
      } else {
        language = 'javascript'
      }

      return (
        <SyntaxHighlighter language={language} style={docco}>
          {code}
        </SyntaxHighlighter>
      )
    } else {
      return msg
    }
  }

  return (
    <div className="roomContainer">
      <h2># {room} </h2>
      <div className="chatBox">
        <div className="message-box">
          <div className="welcome">Welcome {username} to the room</div>
          <div className="display-message-container">
            {messages.map((mes, index) => {
              return (
                <div className="display-message" key={index}>
                  <div className="lineBreak">{mes.name}</div>
                  {formatMessage(mes.message)}
                </div>
              )
            })}
          </div>
        </div>

        <MessageInput handleSubmitMessage={handleSubmitMessage} />
      </div>
      <div className="backPadding">
        <Link to="/rooms">
          <button className="chatButton">Back</button>
        </Link>
      </div>
    </div>
  )
}

export default Chat
