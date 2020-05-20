import React from 'react'
import { Route } from 'react-router-dom';
import io from 'socket.io-client'
import './index.scss'

import Main from './components/Main'
import CreateRoom from './components/CreateRoom'
import Room from './components/Room'
import JoinNewRoom from './components/JoinNewRoom'
// const HOST = window.location.origin

window.socket = io('http://localhost:5000/')


// window.socket = io(HOST)
// window.socket = io(`http://130.233.101.204:5000`)
// window.socket = io(`http://192.168.1.4:5000`)

//


const App = () => {
  return (
    <div className='app'>
      <Route exact path="/" component={Main}/>
      <Route path='/createroom' component={CreateRoom}/>
      <Route path='/rooms/:id' component={Room}/>
      <Route path='/auth' component={JoinNewRoom}/>
    </div>
  )
}

export default App
