import React from 'react'
import eventsConst from '../eventsConst'

const locations = [
  {
    latitude: 59.3293,
    longitude: 18.0686,
    name: 'Stockholm',
  },
  {
    latitude: 59.9139,
    longitude: 10.7522,
    name: 'Oslo',
  },
  {
    latitude: 40.4168,
    longitude: 3.7038,
    name: 'Madrid',
  },
  {
    // 52.5200° N, 13.4050° E
    latitude: 52,
    longitude: 13,
    name: 'Berlin',
  },
  {
    // 55.7558° N, 37.6173° E
    latitude: 55.7558,
    longitude: 37.52,
    name: 'Moscow',
  },
  {
    latitude: 41.8902,
    longitude: 12.4923,
    name: 'Rome',
  },

  {
    latitude: 48.8647,
    longitude: 2.349,
    name: 'Paris',
  },

  {
    latitude: 47.4979,
    longitude: 19.0402,
    name: 'Budapest',
  },
  {
    latitude: 52.3718,
    longitude: 4.896,
    name: 'Amsterdam',
  },

  {
    latitude: 59.4369,
    longitude: 24.7535,
    name: 'Tallin',
  },
]

export default ({ setCoords, setAddress }) => {
  const LocationButton = ({ data }) => (
    <div
      className='location-button'
      {...data}
      onClick={() => {
        setCoords({
          latitude: data.latitude,
          longitude: data.longitude,
        })
        setAddress(data.name)
        window.socket.emit(eventsConst.placeChange, data)
      }}
    >
      <div>{data.name}</div>
      <div>
        <i className='material-icons'>airplanemode_active</i>
      </div>
    </div>
  )

  return (
    <div className='location-buttons-container'>
      {locations.map(el => (
        <LocationButton data={el} key={el.name} />
      ))}
    </div>
  )
}
