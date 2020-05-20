import React, { useEffect, useState, useRef } from 'react'
import eventsConst from '../eventsConst'
import { unary, chain } from 'lodash'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

const width = 720
const height = 720
let map

export default () => {
  const [mapData, setMapData] = useState([])
  const [colorMap, setColorMap] = useState({})
  const canvasRef = useRef()

  const placeChangeHandler = (data, colorMap) => {
    console.log('handle map update', data, colorMap)
    setMapData(data)
    setColorMap(colorMap)
  }

  const [section, setSection] = useState('canvas')

  useEffect(() => {
    window.socket.on(eventsConst.placeChange, placeChangeHandler)
    return () => {
      window.socket.removeListener(eventsConst.placeChange, placeChangeHandler)
    }
  }, [])

  useEffect(() => {
    if (section === 'canvas') {
      // draw canvas here
      const ctx = canvasRef.current.getContext('2d')
      // Black background
      // ctx.fillStyle = '#BFBFBF'
      // Draw rectangle for the background
      // ctx.fillRect(0, 0, width, height)
      // const ctx = canvasRef.current.getContext('2d')
      ctx.fillStyle = '#F2F2F2'
      ctx.fillRect(0, 0, width, height)
      ctx.font = '12px Inconsolata'
      // latitude: 60.1873614, longitude: 24.8366263, name: "Current"
      const dataToCoords = el => {
        const uid = el[0]
        const { name } = el[1]
        const coords = chain(el[1])
          .pick(['latitude', 'longitude'])
          .mapValues(unary(parseInt))
          .mapValues(el => (el * width) / 90)
          .value()
        return {
          // uid,
          ...coords,
          color: colorMap[uid],
          name,
        }
      }
      const coordsList = mapData.map(dataToCoords)
      // console.log(coordsList)
      coordsList.forEach(coords => {
        ctx.fillStyle = coords.color
        ctx.fillRect(coords.longitude, height - coords.latitude, 10, 10)
        ctx.fillText(
          coords.name,
          coords.longitude + 15,
          height - coords.latitude + 5,
        )
      })
    }
  }, [mapData, colorMap, section])

  // const Pin = ({ id, longitude, latitude, name }) => (
  //   <div className='pin'>
  //     <div>{id}</div>
  //     <div>{longitude}</div>
  //     <div>{latitude}</div>
  //     <div>{name}</div>
  //   </div>
  // )

  return (
    <div>
      <div>
        <canvas ref={canvasRef} width={width} height={height} />
        <div id='map' style={{ width, height }}>
          <Map center={[60, 24]} zoom={5} style={{ width, height }}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
            />
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {mapData.map(d => {
              // console.log(2222, d)
              const [uid, position] = d
              if (!d) return
              console.log(22333, position)
              return (
                <Marker
                  position={[position.latitude, position.longitude]}
                  key={uid}
                >
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              )
            })}
          </Map>
        </div>
      </div>

      {/* {mapData.map(([id, data]) => (
        <Pin id={id} {...data} key={id} />
      ))} */}
    </div>
  )
}
