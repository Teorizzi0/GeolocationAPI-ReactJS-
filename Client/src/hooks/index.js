import { useState, useEffect, useRef } from 'react'
import eventsConst from '../eventsConst'
import Geocode from 'react-geocode'

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey('AIzaSyD_FDJ_tv1sCOg80r5m4M-lF3xhDvGE-ks')

// Enable or disable logs. Its optional.
Geocode.enableDebug()

const geoEffect = callback => {
  if (window.isSecureContext) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(callback)
    }
  } else {
    alert('not secure context')
  }
}

const useGeo = () => {
  const [coords, setCoords] = useState(undefined)
  const [address, setAddress] = useState('')

  useEffect(() => {
    geoEffect(async ({ coords }) => {
      console.log(coords, 'uesGeo')
      setCoords(coords)
      const { latitude, longitude } = coords
      const response = await Geocode.fromLatLng(latitude, longitude)
      console.log(response)
      let parseResult = 'Current'
      if (response.status === 'OK') {
        parseResult = response.results[0].formatted_address
        setAddress(parseResult)
      }
      window.socket.emit(eventsConst.placeChange, {
        latitude,
        longitude,
        name: parseResult,
      })
 

    })
  }, [])

  return [coords, setCoords, address, setAddress]
}

const usePrev = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

const useSubscription = (event, handler) => {
  useEffect(() => {
    window.socket.on(event, handler)
    window.home.on(event,handler)
    return () => {
      window.socket.removeListener(event, handler)
      window.home.removeListener(event, handler)
    }
  }, [event, handler])
}

export { useSubscription, usePrev, useGeo, geoEffect }
