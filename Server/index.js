const PORT = process.env.PORT || 5000

const express = require('express')
const cors = require('cors')
const eventsConst = require('./eventsConst')
const _ = require('lodash')
const path = require('path')

const palette = require('./constants').palette
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static('build'))

app.use(cors())

// uid -> color
const colorMap = {}
const allocatedColors = new Set()

// const allUsers = new Set()
// uid -> data
// const placeMap = {}

// uid -> roomId
const roomMap = {}

// roomId -> uid -> data
const roomPlaceMap = {}
const roomAllUsers = {}
const roomColorMap = {}

const allocateColor = uid => {
  let color = palette.find(c => !allocatedColors.has(c))
  if (!color) {
    color = palette[2]
  }
  colorMap[uid] = color
  allocatedColors.add(color)
}

const releaseColor = uid => {
  allocatedColors.delete(colorMap[uid])
  delete colorMap[uid]
}

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./build/index.html'))
})

io.on('connect', socket => {
  const _id = socket.id.substring(0, 5)

  socket.on('myRoom', roomId => {
    console.log(roomId)
    roomMap[_id] = roomId
    socket.join(roomId)
    if (!roomAllUsers[roomId]) {
      console.log(123)
      roomAllUsers[roomId] = new Set()
      roomAllUsers[roomId].add(_id)
    } else {
      roomAllUsers[roomId].add(_id)
    }
  })

  console.log(_id, 'connected')

  allocateColor(_id)

  socket.on(eventsConst.initQuery, () => {
    const roomId = roomMap[_id]
    const placeMap = roomPlaceMap[roomId]

    if (!placeMap) {
      roomPlaceMap[roomId] = {}
    }
    if (!roomAllUsers[roomId]) {
      console.log(123)
      roomAllUsers[roomId] = new Set()
      console.log(roomAllUsers[roomId], 'here')
    } else {
      console.log(roomAllUsers[roomId], 'allusers here')
    }
    const allUsers = roomAllUsers[roomId]
    io.to(roomId).emit(
      eventsConst.activeMembers,
      Array.from(allUsers),
      colorMap,
    )
    io.to(roomId).emit(eventsConst.placeChange, _.toPairs(placeMap), colorMap)
  })

  socket.on('leave', () => {
    const roomId = roomMap[_id]
    if (!roomAllUsers[roomId]) {
      roomAllUsers[roomId] = new Set()
    }
    if (!roomPlaceMap[roomId]) {
      roomPlaceMap[roomId] = {}
    }
    const allUsers = roomAllUsers[roomId]
    const placeMap = roomPlaceMap[roomId]

    //console.log(_id, 'leave')
    allUsers.delete(_id)
    delete placeMap[_id]
    delete roomMap[_id]
    // releaseColor(_id)
    // console.log('user set:', allUsers)
    socket
      .to(roomId)
      .broadcast.emit(eventsConst.activeMembers, Array.from(allUsers), colorMap)

    socket
      .to(roomId)
      .broadcast.emit(eventsConst.placeChange, _.toPairs(placeMap), colorMap)
    socket.leaveAll()
  })

  socket.on('disconnect', () => {
    const roomId = roomMap[_id]
    if (!roomAllUsers[roomId]) {
      roomAllUsers[roomId] = new Set()
    }
    if (!roomPlaceMap[roomId]) {
      roomPlaceMap[roomId] = {}
    }
    const allUsers = roomAllUsers[roomId]
    const placeMap = roomPlaceMap[roomId]

    //console.log(_id, 'disconnected')
    allUsers.delete(_id)
    delete placeMap[_id]
    delete roomMap[_id]
    releaseColor(_id)
    // console.log('user set:', allUsers)
    socket
      .to(roomId)
      .broadcast.emit(eventsConst.activeMembers, Array.from(allUsers), colorMap)

    socket
      .to(roomId)
      .broadcast.emit(eventsConst.placeChange, _.toPairs(placeMap), colorMap)
    socket.leaveAll()
  })

  socket.on(eventsConst.placeChange, data => {
    const roomId = roomMap[_id]
    if (!roomPlaceMap[roomId]) {
      roomPlaceMap[roomId] = {}
    }
    const placeMap = roomPlaceMap[roomId]
    placeMap[_id] = data
    // console.log(data)
    io.to(roomId).emit(eventsConst.placeChange, _.toPairs(placeMap), colorMap)
  })
})

http.listen(PORT, () => {
  console.log('@5000')
})
