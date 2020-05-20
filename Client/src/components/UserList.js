import React, { useEffect, useState } from 'react'
import eventsConst from '../eventsConst'
import { Link } from "react-router-dom";



export default (props) => {

  const [allUsers, setAllUsers] = useState([])

  const [colorMap, setColorMap] = useState({})
  const [myStat, setMyStat] = useState(undefined)

  var socketAdmin = null

  var room

  if (props.isRoom) {
    console.log("is room")
    room = props.room
    socketAdmin = window.room
  }
  else {
    console.log("not room")
    room = 'main'
    socketAdmin = window.socket
  }


  useEffect(() => {

    socketAdmin.emit('joinRoom', room)
    socketAdmin.on('newU', (msg) => {
      console.log(msg)
    })
    const iId = setInterval(() => {
      const socket = socketAdmin
      if (socket) {
        setMyStat(socket.id)
        clearInterval(iId)
        console.log('set my status')
      }
    }, 200)
  })

  const activeMembersHandler = (userList, colorMap) => {
    console.log('handle user list update', colorMap)
    setAllUsers(userList)
    setColorMap(colorMap)
  }

  useEffect(() => {
    socketAdmin.emit('myRoom', room)
    socketAdmin.emit(eventsConst.initQuery)
    socketAdmin.on(eventsConst.activeMembers, activeMembersHandler)
    return () => {
      socketAdmin.removeListener(
        eventsConst.activeMembers,
        activeMembersHandler,
      )
    }
  }, [])

  const leaveRoom = () => {
    socketAdmin.emit('leave')
  }



  return (
    <div>
      {myStat ? (
        <div id='my-status'>
          <i className='material-icons'>account_circle</i>
          <span
            style={{
              color: colorMap[myStat.substring(0, 5)],
            }}
          >
            {myStat.substring(0, 5)}
          </span>
        </div>
      ) : (
          'connecting...'
        )}
      <div id='user-list'>
        <div className='bold'>Active users</div>
        <ul className='clean-list'>
          {allUsers.map((u, idx) => (
            <li key={idx}>
              <div
                className='user-item'
                style={{
                  background: colorMap[u],
                }}
              >
                {u}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button className="create-room-b" id='create-room-b' onClick={leaveRoom}><Link to={`/createroom`} style={{ textDecoration: 'none', color: 'inherit' }}>Create a private room</Link></button>
        <button className="create-room-b" id='join-room-b' onClick={leaveRoom}><Link to={`/auth`} style={{ textDecoration: 'none', color: 'inherit' }}>Join a private room</Link></button>
      </div>


    </div>
  )
}
