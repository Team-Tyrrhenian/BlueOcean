import React, { useState, useEffect, useRef, useContext } from 'react'
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, StandaloneSearchBox } from '@react-google-maps/api';
import { MainContext } from '../../../contexts/MainContext.js'
import axios from 'axios';
import {Button} from 'react-bootstrap';

const librariesArray = ['places'];
const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 41.878253,
  lng: -87.72995
};

function DriverTripMap(props) {
  let [directionsResult, setDirections] = useState(undefined);
  let [startTime, setStartTime] = useState('');
  let [startPoint, setStartPoint] = useState('');
  let [endPoint, setEndPoint] = useState('');
  let { currentUser } = useContext(MainContext);
  let [directionsRequest, setRequest] = useState({
    origin: 'New York, NY, USA',
    destination: 'New York, NY, USA',
    travelMode: 'DRIVING'
  });

  useEffect(() => {

  }, [directionsRequest])

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.MAPS_API_KEY,
    libraries: librariesArray
  });

  const directionsCallback = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
    }
  }

  const renderDirections = () => {
    setRequest({ ...directionsRequest, origin: startPoint[0].formatted_address, destination: endPoint[0].formatted_address });
    setDirections(undefined);
  }

  const onStartLoad = (ref) => setStartPoint(ref);

  const onEndLoad = (ref) => setEndPoint(ref);

  const onStartChanged = () => setStartPoint(startPoint.getPlaces());

  const onEndChanged = () => setEndPoint(endPoint.getPlaces());

  const addTrip = () => {
    axios.post('/AddDriverTrip', {
      start_address: directionsResult.request.origin.query,
      end_address: directionsResult.request.destination.query,
      start_time: startTime,
      user_id: currentUser.userId
    })
      .then((response) => {
        alert('Trip Added!');
      })
      .catch((error) => {
        console.log('AddTrip Error: ', error);
      });
  }

  const addStartTime = (event) => {
    setStartTime(event.target.value);
  }

  return (
    !isLoaded ? <div>Loading</div> :
      <div>
        <GoogleMap
          id='map'
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          { /* Child components, such as markers, info windows, etc. */}
          {!directionsResult ? <DirectionsService callback={directionsCallback} options={directionsRequest} /> : null}
          {!directionsResult ? null : <DirectionsRenderer directions={directionsResult}/>}
          <></>
          <StandaloneSearchBox
            onLoad={onStartLoad}
            onPlacesChanged={onStartChanged}
          >
            <input
              type="text"
              placeholder="Start Point"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                bottom: "9%"
              }}
            />
          </StandaloneSearchBox>
          <StandaloneSearchBox
            onLoad={onEndLoad}
            onPlacesChanged={onEndChanged}
          >
            <input
              type="text"
              placeholder="End Point"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                bottom: '0'
              }}
            />
          </StandaloneSearchBox>
        </GoogleMap>
        <Button variant='primary' onClick={renderDirections}>Get Directions</Button>
        <Button variant='primary' onClick={addTrip}>Add Trip</Button>
        <label htmlFor="start-time">Departure Date and Time:</label>
        <input type="datetime-local" id="start-time"
          name="start-time" value="2022-02-01T00:00"
          min="2022-02-01T00:00" max="2022-06-14T00:00" onChange={addStartTime} />
        {!directionsResult ? null :
          <div>
            From: {' ' + directionsResult.request.origin.query}
            <br />
            To: {' ' + directionsResult.request.destination.query}
            <br />
            length:{' ' + directionsResult.routes[0].legs[0].distance.text}
            <br />
            duration:{' ' + directionsResult.routes[0].legs[0].duration.text}
          </div>
        }
      </div>
  )
}

export default React.memo(DriverTripMap)