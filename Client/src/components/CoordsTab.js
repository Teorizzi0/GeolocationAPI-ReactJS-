import React from 'react'

export default ({ coords }) => {
  if (!coords) return <div>Getting position...</div>
  else {
    const { latitude, longitude } = coords

    return (
      <div className='coords-tab'>
        <div>latitude: {latitude}</div>
        <div>longitude: {longitude}</div>
      </div>
    )
  }
}
