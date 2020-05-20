import React from 'react'
import Map from './Map'
import UserList from './UserList'
import LocationService from './LocationService'

const Main = () =>{
    return (
      <div>
        <div className='fl w-40 pl5 mt5'>
          <UserList isRoom={false}/>
          <LocationService />
        </div>
        <div className='fr w-40 pa1 mt4'>
          <Map />
        </div>
      </div>
)}

export default Main

  