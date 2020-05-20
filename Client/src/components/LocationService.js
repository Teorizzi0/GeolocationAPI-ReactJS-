import React, { useEffect, useState } from 'react'
import eventsConst from '../eventsConst'
import CoordsTab from './CoordsTab'
import LocationSelector from './LocationSelector'
import { useGeo, usePrev, geoEffect } from '../hooks/index'
import { range } from 'lodash'

export default () => {
  const [coords, setCoords, address, setAddress] = useGeo()
  const prevCoords = usePrev(coords)

  const [pending, setPending] = useState(false)
  // console.log('prev:', prevCoords)
  // console.log(coords)

  useEffect(() => {
    if (!prevCoords) return
    const delta = [coords, prevCoords]
      .map(el => [el.latitude, el.longitude])
      .reduce((acc, cur) => {
        range(cur.length).map((v, i) => {
          acc[i] -= cur[i]
        })
        return acc
      })
    if (delta.some(v => v > 0.01)) {
      console.log('change delta:', delta)
    }
  }, [coords, prevCoords])

  const Prev = () =>
    !prevCoords ? (
      <div></div>
    ) : (
      <div id='previous-location'>
        <div style={{ display: 'flex' }}>
          <div>Previous </div> <i className='material-icons'>history</i>
        </div>
        <CoordsTab coords={prevCoords} />
      </div>
    )

  return (
    <>
      <div id='current-location'>
        <div
          className='location-button'
          onClick={() => {
            setPending(true)
            geoEffect(({ coords }) => {
              setCoords(coords)
              setAddress('Current')
              console.log('updated position', coords)
              const { latitude, longitude } = coords
              let parseResult = 'Current'
              window.socket.emit(eventsConst.placeChange, {
                latitude,
                longitude,
                name: parseResult,
              })
              setPending(false)
            })
          }}
        >
          <div>Current </div> <i className='material-icons'>near_me</i>
        </div>
        {pending ? (
          <div>Updating ...</div>
        ) : (
          <>
            <div className='serif'>{address}</div>
            <CoordsTab coords={coords} />{' '}
          </>
        )}
      </div>
      <Prev />
      <LocationSelector setCoords={setCoords} setAddress={setAddress} />
    </>
  )
}
